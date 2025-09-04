import { buildServer } from "./server";

async function start() {
  try {
    const server = await buildServer();

    const port = 3001;
    const host = "0.0.0.0";

    await server.listen({ port, host });

    console.log(`🚀 Servidor rodando em http://localhost:${port}`);
    console.log(`📚 Documentação disponível em http://localhost:${port}/docs`);
  } catch (err) {
    console.error("Erro ao iniciar o servidor:", err);
    process.exit(1);
  }
}

start();
