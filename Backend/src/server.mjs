import fastify from "./app.mjs";
import { env } from "./config/env.ts"

const PORT = env.port || 4000;

try {
    await fastify.listen({port: PORT, host: "0.0.0.0"});
    console.log("Servidor rodando na porta 3000.")
} catch (err) {
    fastify.log.error(err);
    process.exit(1);
}