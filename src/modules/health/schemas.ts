import { ApiErrorSchema, ApiSuccessSchema } from '@/core/http/schemas';
import { z } from 'zod';

// Schema para resposta de health check
export const HealthCheck = z.object({
  status: z.literal('ok'),
  timestamp: z.string(),
  uptime: z.number(),
  version: z.string(),
});

// Schemas para envelope da API
export const HealthCheckApiResponse = ApiSuccessSchema(HealthCheck);
export const HealthCheckApiError = ApiErrorSchema;

// Tipos inferidos
export type HealthCheckView = z.infer<typeof HealthCheck>;
