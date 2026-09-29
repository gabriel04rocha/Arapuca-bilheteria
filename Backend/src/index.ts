import fastify from "./fastify.js";
import { FastifyReply, FastifyRequest } from "fastify";

fastify.get("/", async (request: FastifyRequest, reply: FastifyReply) => {
  return { message: "Servidor rodando!" };
});

// try {
fastify.listen({
  port: Number(process.env.PORT) || 3000,
});
fastify.log.info("Servidor rodando na porta 4000.");
// } catch (err) {
//   fastify.log.error(err);
//   process.exit(1);
// }
