import type { FastifyInstance } from "fastify";
import {
  createCompany,
  deleteCompany,
  getCompany,
  getMyCompany,
  updateCompany,
} from "./controllers";
import {
  CompanyApiError,
  CreateCompanyApiResponse,
  CreateCompanyBody,
  GetCompanyApiResponse,
  UpdateCompanyApiResponse,
  UpdateCompanyBody,
} from "./schemas";

export async function companyRoutes(app: FastifyInstance) {
  // POST /companies - Criar empresa
  app.post(
    "/companies",
    {
      schema: {
        body: CreateCompanyBody,
        response: {
          201: CreateCompanyApiResponse,
          400: CompanyApiError,
          401: CompanyApiError,
          409: CompanyApiError,
          500: CompanyApiError,
        },
        tags: ["Companies"],
        summary: "Criar empresa",
        description:
          "Cria uma nova empresa para o usuário autenticado. Cada usuário pode ter apenas uma empresa.",
      },
    },
    createCompany
  );

  // GET /companies/me - Obter minha empresa
  app.get(
    "/companies/me",
    {
      schema: {
        response: {
          200: GetCompanyApiResponse,
          401: CompanyApiError,
          404: CompanyApiError,
          500: CompanyApiError,
        },
        tags: ["Companies"],
        summary: "Obter minha empresa",
        description: "Retorna a empresa do usuário autenticado.",
      },
    },
    getMyCompany
  );

  // GET /companies/:id - Obter empresa por ID
  app.get(
    "/companies/:id",
    {
      schema: {
        params: {
          type: "object",
          properties: {
            id: { type: "string", format: "uuid" },
          },
          required: ["id"],
        },
        response: {
          200: GetCompanyApiResponse,
          401: CompanyApiError,
          403: CompanyApiError,
          404: CompanyApiError,
          500: CompanyApiError,
        },
        tags: ["Companies"],
        summary: "Obter empresa por ID",
        description:
          "Retorna uma empresa específica. Apenas o dono pode acessar.",
      },
    },
    getCompany
  );

  // PUT /companies/:id - Atualizar empresa
  app.put(
    "/companies/:id",
    {
      schema: {
        params: {
          type: "object",
          properties: {
            id: { type: "string", format: "uuid" },
          },
          required: ["id"],
        },
        body: UpdateCompanyBody,
        response: {
          200: UpdateCompanyApiResponse,
          400: CompanyApiError,
          401: CompanyApiError,
          403: CompanyApiError,
          404: CompanyApiError,
          500: CompanyApiError,
        },
        tags: ["Companies"],
        summary: "Atualizar empresa",
        description:
          "Atualiza os dados de uma empresa. Apenas o dono pode editar.",
      },
    },
    updateCompany
  );

  // DELETE /companies/:id - Excluir empresa
  app.delete(
    "/companies/:id",
    {
      schema: {
        params: {
          type: "object",
          properties: {
            id: { type: "string", format: "uuid" },
          },
          required: ["id"],
        },
        response: {
          204: {
            type: "object",
            description: "Empresa excluída com sucesso",
          },
          401: CompanyApiError,
          403: CompanyApiError,
          404: CompanyApiError,
          500: CompanyApiError,
        },
        tags: ["Companies"],
        summary: "Excluir empresa",
        description:
          "Exclui uma empresa. Apenas o dono pode excluir. Esta ação é irreversível.",
      },
    },
    deleteCompany
  );
}
