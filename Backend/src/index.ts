import fastify from "./fastify.js";
import { FastifyReply, FastifyRequest } from "fastify";

fastify.get("/", async (request: FastifyRequest, reply: FastifyReply) => {
  return { message: "Servidor rodando!" };
});

try {
  await fastify.listen({
    port: Number(process.env.PORT) || 3000,
    host: "0.0.0.0",
  });
  console.log("Servidor rodando na porta 3000.");
} catch (err) {
  fastify.log.error(err);
  process.exit(1);
}
