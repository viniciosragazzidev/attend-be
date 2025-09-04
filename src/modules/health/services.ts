import { HealthCheckView } from "./schemas";

export async function getHealthCheck(): Promise<HealthCheckView> {
  return {
    status: "ok",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    version: process.env.npm_package_version || "1.0.0",
  };
}
