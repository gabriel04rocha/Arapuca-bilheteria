import fastify, { FastifyReply, FastifyRequest } from "fastify";
import { auth } from "../lib/auth.js";
import { fromNodeHeaders } from "better-auth/node";

export async function requireAuth(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  request.log.info(
    {
      cookie: request.headers.cookie,
      authorization: request.headers.authorization,
      origin: request.headers.origin,
      host: request.headers.host,
      forwardedHost: request.headers["x-forwarded-host"],
      forwardedProto: request.headers["x-forwarded-proto"],
    },
    "AUTH DEBUG",
  );

  const session = await auth.api.getSession({
    headers: fromNodeHeaders(request.headers),
  });

  request.log.info(
    {
      hasSession: !!session,
      userId: session?.user.id,
      sessionId: session?.session.id,
    },
    "AUTH SESSION DEBUG",
  );

  if (!session) {
    return reply.status(401).send({
      error: "UNAUTHENTICATED_USER",
      message: "O usuário deve estar autenticado para usar este recurso.",
    });
  }

  request.user = session.user;
  request.session = session.session;
}
