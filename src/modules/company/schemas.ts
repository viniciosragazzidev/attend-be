import { ApiErrorSchema, ApiSuccessSchema } from "@/core/http/schemas";
import { z } from "zod";

// Schema para criação de empresa (DTO)
export const CreateCompanyBody = z.object({
  name: z.string().min(1, "Nome é obrigatório").max(255, "Nome muito longo"),
});

// Schema para atualização de empresa (DTO)
export const UpdateCompanyBody = z.object({
  name: z.string().min(1, "Nome é obrigatório").max(255, "Nome muito longo"),
});

// Schema para resposta de empresa (View)
export const CompanyView = z.object({
  id: z.string().uuid(),
  name: z.string(),
  ownerId: z.string(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

// Schema para lista de empresas
export const CompanyList = z.array(CompanyView);

// Schema para parâmetros de rota
export const CompanyParams = z.object({
  id: z.string().uuid("ID inválido"),
});

// Schemas para envelope da API
export const CreateCompanyApiResponse = ApiSuccessSchema(CompanyView);
export const UpdateCompanyApiResponse = ApiSuccessSchema(CompanyView);
export const GetCompanyApiResponse = ApiSuccessSchema(CompanyView);
export const CompanyApiError = ApiErrorSchema;

// Tipos inferidos
export type CreateCompanyDto = z.infer<typeof CreateCompanyBody>;
export type UpdateCompanyDto = z.infer<typeof UpdateCompanyBody>;
export type CompanyViewType = z.infer<typeof CompanyView>;
export type CompanyListView = z.infer<typeof CompanyList>;
