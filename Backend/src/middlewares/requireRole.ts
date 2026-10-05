import { FastifyReply, FastifyRequest } from "fastify";

export function requireRole(allowedRoles: string[]) {
  return async (request: FastifyRequest, reply: FastifyReply) => {
    if (
      allowedRoles &&
      (!request.user.role || !allowedRoles.includes(request.user.role))
    ) {
      return reply.status(403).send({
        error: "FORBIDDEN",
        message:
          "O usuário não tem as permissões necessárias para usar este recurso.",
      });
    }
  };
}
