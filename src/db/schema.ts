import { relations } from "drizzle-orm";
import {
  boolean,
  integer,
  pgTable,
  primaryKey,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

export const user = pgTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified")
    .$defaultFn(() => false)
    .notNull(),
  image: text("image"),
  createdAt: timestamp("created_at")
    .$defaultFn(() => /* @__PURE__ */ new Date())
    .notNull(),
  updatedAt: timestamp("updated_at")
    .$defaultFn(() => /* @__PURE__ */ new Date())
    .notNull(),
});

export const session = pgTable("session", {
  id: text("id").primaryKey(),
  expiresAt: timestamp("expires_at").notNull(),
  token: text("token").notNull().unique(),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
});

export const account = pgTable("account", {
  id: text("id").primaryKey(),
  accountId: text("account_id").notNull(),
  providerId: text("provider_id").notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  idToken: text("id_token"),
  accessTokenExpiresAt: timestamp("access_token_expires_at"),
  refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
  scope: text("scope"),
  password: text("password"),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
});

export const verification = pgTable("verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").$defaultFn(
    () => /* @__PURE__ */ new Date()
  ),
  updatedAt: timestamp("updated_at").$defaultFn(
    () => /* @__PURE__ */ new Date()
  ),
});

// Tabela da Empresa/Negócio
export const company = pgTable("company", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 255 }).notNull(),
  ownerId: uuid("owner_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }), // Relacionamento com o dono
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Relação: Um usuário (dono) pode ter uma empresa
export const userRelations = relations(user, ({ one }) => ({
  company: one(company, {
    fields: [user.id],
    references: [company.ownerId],
  }),
}));

// Relação: Uma empresa tem um dono
export const companyRelations = relations(company, ({ one }) => ({
  owner: one(user, {
    fields: [company.ownerId],
    references: [user.id],
  }),
}));

// Tabela de Serviços
export const service = pgTable("service", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  duration: integer("duration").notNull(), // Duração em minutos
  price: integer("price").notNull(), // Preço em centavos para evitar problemas com float
  companyId: uuid("company_id")
    .notNull()
    .references(() => company.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Tabela de Profissionais
export const professional = pgTable("professional", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 255 }).notNull(),
  companyId: uuid("company_id")
    .notNull()
    .references(() => company.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Tabela de associação N-para-N entre Profissionais e Serviços
// Um profissional pode realizar vários serviços, e um serviço pode ser realizado por vários profissionais.
export const professionalsToServices = pgTable(
  "professionals_to_services",
  {
    professionalId: uuid("professional_id")
      .notNull()
      .references(() => professional.id),
    serviceId: uuid("service_id")
      .notNull()
      .references(() => service.id),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.professionalId, t.serviceId] }),
  })
);

// Tabela de Clientes (do negócio, não usuários do sistema)
export const client = pgTable("client", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).unique(),
  phone: varchar("phone", { length: 20 }),
  companyId: uuid("company_id")
    .notNull()
    .references(() => company.id, { onDelete: "cascade" }), // Cliente pertence a uma empresa
});

// Tabela de Agendamentos
export const appointment = pgTable("appointment", {
  id: uuid("id").primaryKey().defaultRandom(),
  startTime: timestamp("start_time", { withTimezone: true }).notNull(),
  endTime: timestamp("end_time", { withTimezone: true }).notNull(),
  status: varchar("status", {
    enum: ["scheduled", "completed", "canceled"],
  }).default("scheduled"),
  companyId: uuid("company_id")
    .notNull()
    .references(() => company.id, { onDelete: "cascade" }),
  clientId: uuid("client_id")
    .notNull()
    .references(() => client.id),
  professionalId: uuid("professional_id")
    .notNull()
    .references(() => professional.id),
  serviceId: uuid("service_id")
    .notNull()
    .references(() => service.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
