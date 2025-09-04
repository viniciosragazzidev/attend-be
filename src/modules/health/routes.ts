import type { FastifyInstance } from "fastify";
import { healthCheck } from "./controllers";

export async function healthRoutes(app: FastifyInstance) {
  app.get(
    "/health",
    {
      schema: {
        response: {
          200: {
            type: "object",
            properties: {
              success: { type: "boolean" },
              data: {
                type: "object",
                properties: {
                  status: { type: "string" },
                  timestamp: { type: "string" },
                  uptime: { type: "number" },
                  version: { type: "string" },
                },
                required: ["status", "timestamp", "uptime", "version"],
              },
              meta: {
                type: "object",
                properties: {
                  timestamp: { type: "string" },
                  requestId: { type: "string" },
                },
              },
            },
            required: ["success", "data"],
          },
          500: {
            type: "object",
            properties: {
              success: { type: "boolean" },
              error: {
                type: "object",
                properties: {
                  code: { type: "string" },
                  message: { type: "string" },
                  details: {},
                },
                required: ["code", "message"],
              },
            },
            required: ["success", "error"],
          },
        },
        tags: ["Health"],
        summary: "Health Check",
        description:
          "Verifica o status da aplicação e retorna informações básicas do sistema.",
      },
    },
    healthCheck
  );
}
