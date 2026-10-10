import {
  getTicketsByConfirmedStatus,
  validateDbTicket,
} from "../Services/dbService.js";
import { confirmationIdPayload } from "../types/internalDataTypes.js";
import { createInvoice } from "../Services/dbService.js";
import { DbError } from "../errors/DbError.js";
import fastify, { FastifyReply, FastifyRequest } from "fastify";
import { auth } from "../lib/auth.js";
import { AppError } from "../errors/AppError.js";
import { fromNodeHeaders } from "better-auth/node";

export const getDbTicketsByPaymentStatus = async (
  request: FastifyRequest,
  reply: FastifyReply,
) => {
  try {
    const session = await auth.api.getSession({
      headers: fromNodeHeaders(request.headers),
    });

    const { success } = await auth.api.userHasPermission({
      body: {
        userId: session?.user.id,
        permissions: { project: ["read_guests"] },
      },
    });

    if (!success) {
      throw new AppError({
        name: "USER_DOES_NOT_HAVE_PERMISSION",
        message:
          "O usuário logado não possui permissão para acessar este recurso.",
        statusCode: 401,
      });
    }

    const tickets = await getTicketsByConfirmedStatus();
    const ticketsToSend = tickets.map(
      ({ id, confirmationId, invoice, valid }) => ({
        id: id,
        confirmationId: confirmationId,
        email: invoice.customerEmail,
        name: invoice.customerName,
        phone: invoice.customerPhoneNumber,
        valid: valid,
      }),
    );

    return reply.status(200).send(ticketsToSend);
  } catch (error) {
    if (error instanceof AppError) {
      return reply
        .status(401)
        .send({ error: error.name, message: error.message });
    }

    if (error instanceof DbError) {
      return reply
        .status(404)
        .send({ error: error.name, message: error.message });
    }

    request.log.error("Erro interno do servidor ao buscar os ingressos.");
    return reply.status(500).send({
      name: "INTERNAL_SERVER_ERROR",
      message: "Erro interno do servidor.",
    });
  }
};

export const validateTicket = async (
  request: FastifyRequest<{ Body: confirmationIdPayload }>,
  reply: FastifyReply,
) => {
  try {
    await validateDbTicket(request.body.confirmationID);

    reply.code(201).send();
  } catch (e) {
    if (e instanceof AppError) {
      request.log.error(
        "Houve um erro: O ingresso com o ID de confirmação informado já foi invalidado.",
      );
      return reply.code(409).send({
        name: "TICKET_IS_ALREADY_INVALID",
        message: "Este ingresso já foi invalidado.",
      });
    }

    if (e instanceof DbError) {
      request.log.error(
        "Houve um erro: O ingresso com o ID de confirmação informado não foi encontrado.",
      );
      return reply.code(404).send({
        name: "TICKET_NOT_FOUND",
        message:
          "O ingresso com o ID de confirmação informado não foi encontrado.",
      });
    }

    request.log.error(
      "Houve um erro interno do servidor ao invalidar um ingresso.",
    );
    return reply.code(500).send({
      name: "INTERNAL_SERVER_ERROR",
      message: "Houve um erro interno do servidor.",
    });
  }
};
