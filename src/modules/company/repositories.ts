import { db } from "@/db";
import { company } from "@/db/schema";
import { eq } from "drizzle-orm";
import type { CompanyViewType } from "./schemas";

export async function createCompany(
  name: string,
  ownerId: string
): Promise<CompanyViewType> {
  const [newCompany] = await db
    .insert(company)
    .values({
      name,
      ownerId,
    })
    .returning();

  return {
    id: newCompany.id,
    name: newCompany.name,
    ownerId: newCompany.ownerId,
    createdAt: newCompany.createdAt.toISOString(),
    updatedAt: newCompany.updatedAt.toISOString(),
  };
}

export async function getCompanyById(
  id: string
): Promise<CompanyViewType | null> {
  const result = await db
    .select()
    .from(company)
    .where(eq(company.id, id))
    .limit(1);

  if (result.length === 0) {
    return null;
  }

  const companyData = result[0];
  return {
    id: companyData.id,
    name: companyData.name,
    ownerId: companyData.ownerId,
    createdAt: companyData.createdAt.toISOString(),
    updatedAt: companyData.updatedAt.toISOString(),
  };
}

export async function getCompanyByOwnerId(
  ownerId: string
): Promise<CompanyViewType | null> {
  const result = await db
    .select()
    .from(company)
    .where(eq(company.ownerId, ownerId))
    .limit(1);

  if (result.length === 0) {
    return null;
  }

  const companyData = result[0];
  return {
    id: companyData.id,
    name: companyData.name,
    ownerId: companyData.ownerId,
    createdAt: companyData.createdAt.toISOString(),
    updatedAt: companyData.updatedAt.toISOString(),
  };
}

export async function updateCompany(
  id: string,
  name: string
): Promise<CompanyViewType | null> {
  const [updatedCompany] = await db
    .update(company)
    .set({
      name,
      updatedAt: new Date(),
    })
    .where(eq(company.id, id))
    .returning();

  if (!updatedCompany) {
    return null;
  }

  return {
    id: updatedCompany.id,
    name: updatedCompany.name,
    ownerId: updatedCompany.ownerId,
    createdAt: updatedCompany.createdAt.toISOString(),
    updatedAt: updatedCompany.updatedAt.toISOString(),
  };
}

export async function deleteCompany(id: string): Promise<boolean> {
  const result = await db
    .delete(company)
    .where(eq(company.id, id))
    .returning({ id: company.id });

  return result.length > 0;
}
