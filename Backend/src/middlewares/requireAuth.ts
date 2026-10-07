import { FastifyReply, FastifyRequest } from "fastify";
import { auth } from "../lib/auth.js";
import { fromNodeHeaders } from "better-auth/node";

export function requireAuth() {
  return async (request: FastifyRequest, reply: FastifyReply) => {
    const session = await auth.api.getSession({
      headers: fromNodeHeaders(request.headers),
    });

    console.log(session);

    if (!session) {
      return reply.status(401).send({
        error: "UNAUTHENTICATED_USER",
        message: "O usuário deve estar autenticado para usar este recurso.",
      });
    }

    request.user = session.user;
    request.session = session.session;
  };
}
