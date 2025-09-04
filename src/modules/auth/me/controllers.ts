import { ok } from "@/core/http/reply";
import type { FastifyReply, FastifyRequest } from "fastify";
import * as service from "./services.js";

export async function getCurrentUser(req: FastifyRequest, reply: FastifyReply) {
  try {
    const userData = await service.getCurrentUser(req.headers as any);

    if (!userData) {
      return reply.status(401).send({
        success: false,
        message: "Não autenticado",
      });
    }

    return reply.send(ok(userData));
  } catch (error) {
    console.error("Erro na rota /auth/me:", error);
    return reply.status(500).send({
      success: false,
      message: "Erro interno",
    });
  }
}
