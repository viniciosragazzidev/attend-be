import type { FastifyInstance } from "fastify";
import { getCurrentUser } from "./controllers.js";

export async function authMeRoutes(app: FastifyInstance) {
  app.get(
    "/auth/me",
    {
      schema: {
        response: {
          200: {
            type: "object",
            properties: {
              succe: { type: "boolean" },
              data: {
                type: "object",
                properties: {
                  id: { type: "string" },
                  name: { type: "string" },
                  email: { type: "string" },
                  role: { type: "string" },
                  createdAt: { type: "string" },
                  updatedAt: { type: "string" },
                  deletedAt: { type: "string" },
                },
              },
            },
          },
        },
        tags: ["Auth"],
        summary: "Get current user session",
        description: "Returns the current authenticated user's information.",
      },
    },
    getCurrentUser
  );
}
