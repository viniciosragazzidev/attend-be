import { ok } from '@/core/http/reply';
import type { FastifyReply, FastifyRequest } from 'fastify';
import * as service from './services';

export async function healthCheck(_req: FastifyRequest, reply: FastifyReply) {
  const health = await service.getHealthCheck();
  return reply.send(ok(health));
}
