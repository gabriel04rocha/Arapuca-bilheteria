import fastify from "./fastify.js";
import { env } from "./config/env.js";
import { FastifyReply, FastifyRequest } from "fastify";

const PORT = env.port;

fastify.get("/", async (request: FastifyRequest, reply: FastifyReply) => {
  return { message: "Servidor rodando!" };
});

try {
  await fastify.listen({ port: PORT, host: "0.0.0.0" });
  console.log("Servidor rodando na porta 4000.");
} catch (err) {
  fastify.log.error(err);
  process.exit(1);
}
