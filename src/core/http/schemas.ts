import { z } from 'zod';

// Schema base para envelope de sucesso
export const ApiSuccessSchema = <T extends z.ZodTypeAny>(dataSchema: T) =>
  z.object({
    success: z.literal(true),
    data: dataSchema,
    meta: z.object({
      timestamp: z.string().optional(),
      requestId: z.string().optional(),
    }).optional(),
  });

// Schema base para envelope de erro
export const ApiErrorSchema = z.object({
  success: z.literal(false),
  error: z.object({
    code: z.string(),
    message: z.string(),
    details: z.unknown().optional(),
  }),
  meta: z.object({
    timestamp: z.string().optional(),
    requestId: z.string().optional(),
  }).optional(),
});

// Tipos inferidos
export type ApiSuccess<T> = {
  success: true;
  data: T;
  meta?: {
    timestamp?: string;
    requestId?: string;
  };
};

export type ApiError = {
  success: false;
  error: {
    code: string;
    message: string;
    details?: unknown;
  };
  meta?: {
    timestamp?: string;
    requestId?: string;
  };
};
