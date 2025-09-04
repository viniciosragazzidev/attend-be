import { created, ok } from "@/core/http/reply";
import { auth } from "@/utils/auth";
import type { FastifyReply, FastifyRequest } from "fastify";
import type { CreateCompanyDto, UpdateCompanyDto } from "./schemas";
import * as service from "./services";

// Helper para obter o usuário autenticado
async function getAuthenticatedUser(req: FastifyRequest): Promise<string> {
  const headers = new Headers();
  Object.entries(req.headers).forEach(([key, value]) => {
    if (value) headers.append(key, value.toString());
  });

  const session = await auth.api.getSession({ headers });
  if (!session) {
    throw new Error("UNAUTHORIZED");
  }

  return session.user.id;
}

export async function createCompany(req: FastifyRequest, reply: FastifyReply) {
  const userId = await getAuthenticatedUser(req);
  const data = req.body as CreateCompanyDto;

  const company = await service.createCompany(data, userId);
  return reply.status(201).send(created(company));
}

export async function getCompany(req: FastifyRequest, reply: FastifyReply) {
  const userId = await getAuthenticatedUser(req);
  const { id } = req.params as { id: string };

  const company = await service.getCompanyById(id);

  // Verificar se o usuário é o dono da empresa
  if (company.ownerId !== userId) {
    return reply.status(403).send({
      success: false,
      error: {
        code: "FORBIDDEN",
        message: "Você não tem permissão para acessar esta empresa",
      },
    });
  }

  return reply.send(ok(company));
}

export async function getMyCompany(req: FastifyRequest, reply: FastifyReply) {
  const userId = await getAuthenticatedUser(req);

  const company = await service.getCompanyByOwnerId(userId);
  if (!company) {
    return reply.status(404).send({
      success: false,
      error: {
        code: "COMPANY_NOT_FOUND",
        message: "Empresa não encontrada",
      },
    });
  }

  return reply.send(ok(company));
}

export async function updateCompany(req: FastifyRequest, reply: FastifyReply) {
  const userId = await getAuthenticatedUser(req);
  const { id } = req.params as { id: string };
  const data = req.body as UpdateCompanyDto;

  const company = await service.updateCompany(id, data, userId);
  return reply.send(ok(company));
}

export async function deleteCompany(req: FastifyRequest, reply: FastifyReply) {
  const userId = await getAuthenticatedUser(req);
  const { id } = req.params as { id: string };

  await service.deleteCompany(id, userId);
  return reply.status(204).send();
}
