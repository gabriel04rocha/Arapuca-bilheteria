import fastify from "./app.mjs";

const PORT = process.env.PORT || 4000;

try {
    await fastify.listen({port: PORT});
    console.log("Servidor rodando na porta 3000.")
} catch (err) {
    fastify.log.error(err);
    process.exit(1);
}