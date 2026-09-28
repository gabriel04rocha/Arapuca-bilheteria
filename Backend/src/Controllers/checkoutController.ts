import {
  confirmInvoicePayment,
  createInvoice,
  getTicketByCPF,
} from "../Services/dbService.js";
import { createPaymentLink } from "../Services/infinitePayService.js";
import type { userReceivedInfo } from "../types/internalDataTypes.js";
import type { infinitePayCallbackData } from "../types/infinitePayTypes.js";
import crypto from "crypto";
import { appError } from "../errors/appError.js";
import { FastifyReply, FastifyRequest } from "fastify";

export const getPaymentLink = async (
  request: FastifyRequest<{
    Body: userReceivedInfo;
  }>,
  reply: FastifyReply,
) => {
  try {
    const existingTicket = await getTicketByCPF(request.body.userCPF);

    if (existingTicket) {
      throw new appError({
        name: "CPF_ALREADY_HAS_TICKET",
        message: "Já existe um ingresso cadastrado neste CPF.",
        statusCode: 409,
      });
    }

    const orderNsu = crypto.randomUUID();
    const paymentLink = await createPaymentLink(request.body, orderNsu);
    await createInvoice(request.body, orderNsu);
    return reply.status(200).send(paymentLink);
  } catch (error) {
    if (error instanceof appError) {
      return reply
        .status(409)
        .send({ error: error.name, message: error.message });
    }

    return reply.status(500).send({
      error: "INTERNAL_SERVER_ERROR",
      message: "Erro interno do servidor.",
    });
  }
};

export const confirmPayment = async (
  request: FastifyRequest<{ Body: infinitePayCallbackData }>,
  reply: FastifyReply,
) => {
  try {
    await confirmInvoicePayment(request.body);
    return reply.status(200);
  } catch (error) {
    if (error instanceof appError) {
      return reply.status(400);
    }

    return reply.status(500);
  }
};

export async function getDbTicketById(userCPF: string) {
  const ticket = await getTicketByCPF(userCPF);
  return ticket;
}
