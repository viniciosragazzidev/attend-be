import { DomainError } from "@/core/http/errors";
import * as repository from "./repositories";
import type {
  CompanyViewType,
  CreateCompanyDto,
  UpdateCompanyDto,
} from "./schemas";

export async function createCompany(
  data: CreateCompanyDto,
  ownerId: string
): Promise<CompanyViewType> {
  // Verificar se o usuário já possui uma empresa
  const existingCompany = await repository.getCompanyByOwnerId(ownerId);
  if (existingCompany) {
    throw new DomainError(
      "COMPANY_ALREADY_EXISTS",
      "Usuário já possui uma empresa cadastrada"
    );
  }

  return await repository.createCompany(data.name, ownerId);
}

export async function getCompanyById(id: string): Promise<CompanyViewType> {
  const company = await repository.getCompanyById(id);
  if (!company) {
    throw new DomainError("COMPANY_NOT_FOUND", "Empresa não encontrada");
  }

  return company;
}

export async function getCompanyByOwnerId(
  ownerId: string
): Promise<CompanyViewType | null> {
  return await repository.getCompanyByOwnerId(ownerId);
}

export async function updateCompany(
  id: string,
  data: UpdateCompanyDto,
  ownerId: string
): Promise<CompanyViewType> {
  // Verificar se a empresa existe
  const existingCompany = await repository.getCompanyById(id);
  if (!existingCompany) {
    throw new DomainError("COMPANY_NOT_FOUND", "Empresa não encontrada");
  }

  // Verificar se o usuário é o dono da empresa
  if (existingCompany.ownerId !== ownerId) {
    throw new DomainError(
      "FORBIDDEN",
      "Você não tem permissão para editar esta empresa"
    );
  }

  const updatedCompany = await repository.updateCompany(id, data.name);
  if (!updatedCompany) {
    throw new DomainError(
      "COMPANY_UPDATE_FAILED",
      "Falha ao atualizar empresa"
    );
  }

  return updatedCompany;
}

export async function deleteCompany(
  id: string,
  ownerId: string
): Promise<void> {
  // Verificar se a empresa existe
  const existingCompany = await repository.getCompanyById(id);
  if (!existingCompany) {
    throw new DomainError("COMPANY_NOT_FOUND", "Empresa não encontrada");
  }

  // Verificar se o usuário é o dono da empresa
  if (existingCompany.ownerId !== ownerId) {
    throw new DomainError(
      "FORBIDDEN",
      "Você não tem permissão para excluir esta empresa"
    );
  }

  const deleted = await repository.deleteCompany(id);
  if (!deleted) {
    throw new DomainError("COMPANY_DELETE_FAILED", "Falha ao excluir empresa");
  }
}
