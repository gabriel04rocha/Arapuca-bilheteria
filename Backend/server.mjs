import { buildApp } from "./app.mjs";

const server = await buildApp({
    logger: true
});

const PORT = process.env.PORT || 4000;

try {
    await server.listen({port: PORT});
    console.log("Servidor rodando na porta 3000.")
} catch (err) {
    server.log.error(err);
    process.exit(1);
}