import Fastify from "fastify";
import checkoutRoutes from "./Routes/checkoutRoutes.js";
import cors from "@fastify/cors";
import { fromNodeHeaders } from "better-auth/node";
import { auth } from "./lib/auth.js";
import { prisma } from "./lib/prisma.js";
import dbRoutes from "./Routes/dbRoutes.js";
import { env } from "./config/env.js";
import { appError } from "./errors/appError.js";
import { FastifyError } from "fastify";
import { requireAuth } from "./middlewares/requireAuth.js";

const fastify = Fastify({
  logger: true,
});

await fastify.register(cors, {
  origin: env.trustedOrigins,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  credentials: true,
  maxAge: 86400,
});

fastify.route({
  method: ["GET", "POST"],
  url: "/auth/*",
  async handler(request, reply) {
    try {
      const url = new URL(request.url, `https://${request.headers.host}`);

      const headers = fromNodeHeaders(request.headers);

      const req = new Request(url.toString(), {
        method: request.method,
        headers,
        ...(request.body ? { body: JSON.stringify(request.body) } : {}),
      });

      const response = await auth.handler(req);

      reply.status(response.status);
      response.headers.forEach((value, key) => reply.header(key, value));
      return reply.send(response.body ? await response.text() : null);
    } catch (error) {
      fastify.log.error(
        `Authentication Error: ${error instanceof Error ? error.message : String(error)}`,
      );
      return reply.status(500).send({
        error: "Internal authentication error",
        code: "AUTH_FAILURE",
      });
    }
  },
});

fastify.decorate("prisma", prisma);

fastify.get("/health", async (req, res) => {
  return {
    status: "OK",
    message: "API rodando com Fastify!",
  };
});

await fastify.register(checkoutRoutes, { prefix: "api" });

await fastify.register(async (fastify) => {
  fastify.addHook("preHandler", requireAuth);

  await fastify.register(dbRoutes, { prefix: "api" });
});

fastify.setErrorHandler((error: FastifyError, request, reply) => {
  if (error instanceof appError) {
    return reply.status(409).send({
      error: error.name,
      message: error.message,
    });
  }

  return reply.status(500).send({
    error: error.name,
    message: error.message,
  });
});

export default fastify;
