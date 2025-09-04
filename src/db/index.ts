import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { env } from "../utils/env";
import * as schema from "./schema.js";

// Configuração da conexão
const pool = new Pool({
  connectionString: env.DATABASE_URL,
});

// Instância do Drizzle com todos os schemas
export const db = drizzle(pool, { schema });

// Exportar schemas para uso em outros módulos
export * from "./schema.js";
