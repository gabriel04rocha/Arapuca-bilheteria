import fastify from "./app.js";
import { env } from "./config/env.js"

const PORT = env.port;

try {
    await fastify.listen({port: PORT, host: "0.0.0.0"});
    console.log("Servidor rodando na porta 3000.")
} catch (err) {
    fastify.log.error(err);
    process.exit(1);
}