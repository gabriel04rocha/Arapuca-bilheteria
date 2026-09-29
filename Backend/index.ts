import fastify from "./src/fastify.js";

export default async function handler(request: any, response: any) {
  await fastify.ready();

  fastify.server.emit("request", request, response);
}
