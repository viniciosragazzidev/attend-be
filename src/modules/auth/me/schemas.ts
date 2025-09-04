import { ApiErrorSchema, ApiSuccessSchema } from "@/core/http/schemas";
import { z } from "zod";

// Schema para resposta de usuário autenticado
export const AuthMeResponse = z.object({
  user: z.object({
    id: z.string(),
    email: z.string(),
    name: z.string().optional(),
  }),
  session: z.object({
    id: z.string(),
    userId: z.string(),
  }),
});

// Schemas para envelope da API
export const AuthMeApiResponse = ApiSuccessSchema(AuthMeResponse);
export const AuthMeApiError = ApiErrorSchema;

// Tipos inferidos
export type AuthMeView = z.infer<typeof AuthMeResponse>;
