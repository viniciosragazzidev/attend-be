import { DomainError, HttpStatusByCode } from "@/core/http/errors";
import { fail } from "@/core/http/reply";
import { healthRoutes } from "@/modules/health/routes";
import cors from "@fastify/cors";
import helmet from "@fastify/helmet";
import swagger from "@fastify/swagger";
import swaggerUi from "@fastify/swagger-ui";
import Fastify from "fastify";
import {
  serializerCompiler,
  validatorCompiler,
  ZodTypeProvider,
} from "fastify-type-provider-zod";
import { z } from "zod";
import { zodToJsonSchema } from "zod-to-json-schema";
import { authMeRoutes } from "./modules/auth/me/route";
import { companyRoutes } from "./modules/company/routes";
import { auth } from "./utils/auth";

export async function buildServer() {
  const server = Fastify({
    logger: {
      level: "info",
    },
  }).withTypeProvider<ZodTypeProvider>();

  server.setValidatorCompiler(validatorCompiler);
  server.setSerializerCompiler(serializerCompiler);
  // Plugins de segurança
  await server.register(helmet);
  await server.register(cors, {
    origin: "http://localhost:3000",
    credentials: true,
  });

  //  Better Auth

  server.route({
    method: ["GET", "POST"],
    url: "/api/auth/*",
    async handler(request, reply) {
      try {
        // Construct request URL
        const url = new URL(request.url, `http://${request.headers.host}`);

        // Convert Fastify headers to standard Headers object
        const headers = new Headers();
        Object.entries(request.headers).forEach(([key, value]) => {
          if (value) headers.append(key, value.toString());
        });
        // Create Fetch API-compatible request
        const req = new Request(url.toString(), {
          method: request.method,
          headers,
          body: request.body ? JSON.stringify(request.body) : undefined,
        });
        // Process authentication request
        const response = await auth.handler(req);
        // Forward response to client
        reply.status(response.status);
        response.headers.forEach((value, key) => reply.header(key, value));
        reply.send(response.body ? await response.text() : null);
      } catch (error) {
        server.log.error("Authentication Error:", error as any);
        reply.status(500).send({
          error: "Internal authentication error",
          code: "AUTH_FAILURE",
        });
      }
    },
  });

  // Swagger
  await server.register(swagger, {
    openapi: {
      openapi: "3.0.0",
      info: {
        title: "Attend Backend API",
        description: "API para sistema de atendimento",
        version: "1.0.0",
      },
      servers: [
        {
          url: "http://localhost:3001",
          description: "Servidor de desenvolvimento",
        },
      ],
    },
    transform: ({ schema, url }) => {
      if (!schema || url.includes("auth")) {
        return { schema, url };
      }

      const { response, ...rest } = schema as any;
      const transformedSchema: any = {};

      for (const key in rest) {
        if (rest[key] instanceof z.ZodType) {
          transformedSchema[key] = zodToJsonSchema(rest[key]);
        } else {
          transformedSchema[key] = rest[key];
        }
      }

      if (response) {
        transformedSchema.response = {};
        for (const key in response) {
          if (response[key] instanceof z.ZodType) {
            transformedSchema.response[key] = zodToJsonSchema(response[key]);
          } else {
            transformedSchema.response[key] = response[key];
          }
        }
      }

      return { schema: transformedSchema, url };
    },
  });

  await server.register(swaggerUi, {
    routePrefix: "/docs",
    uiConfig: {
      docExpansion: "list",
      deepLinking: false,
    },
  });

  // Tratamento global de erros
  server.setErrorHandler((error, request, reply) => {
    server.log.error(error);

    if (error instanceof DomainError) {
      const status = HttpStatusByCode[error.code] || 500;
      return reply
        .status(status)
        .send(fail(error.code, error.message, (error as any).details));
    }

    // Erro de validação do Fastify
    if (error.validation) {
      return reply
        .status(400)
        .send(fail("VALIDATION_ERROR", "Dados inválidos", error.validation));
    }

    // Erro interno
    return reply
      .status(500)
      .send(fail("INTERNAL_ERROR", "Erro interno do servidor"));
  });

  // Registro das rotas
  await server.register(healthRoutes);
  await server.register(authMeRoutes);
  await server.register(companyRoutes);

  // Rota raiz
  server.get("/", async (request, reply) => {
    return reply.send({
      message: "Attend Backend API",
      version: "1.0.0",
      docs: "/docs",
    });
  });

  return server;
}
