import { db, user } from "@/db"; // your drizzle instance
import * as schema from "@/db/schema";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg", // or "mysql", "sqlite"
    schema: {
      ...schema,
      user: user,
    },
  }),
  emailAndPassword: {
    enabled: true,
  },
  trustedOrigins: ["http://localhost:3000"],
  // Adicionar configurações de sessão
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 dias
  },
  // Configurar cookies
  cookies: {
    sessionToken: {
      name: "better-auth.session-token",
      httpOnly: true,
      secure: false, // false para desenvolvimento local
      sameSite: "lax",
      path: "/",
    },
  },
});
