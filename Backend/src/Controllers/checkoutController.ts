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
    if (paymentLink.url.startsWith("https://")) {
      await createInvoice(request.body, orderNsu);
      request.log.info(
        {
          order_nsu: orderNsu,
        },
        "Link de pagamento criado com sucesso.",
      );
      return reply.status(200).send(paymentLink);
    } else {
      request.log.error("Falha ao criar o link de pagamento.");
      throw new appError({
        name: "PAYMENT_LINK_CREATION_FAILED",
        statusCode: 500,
        message: "Falha ao criar o link de pagamento.",
      });
    }
  } catch (error: appError | Error | any) {
    if (error instanceof appError && error.statusCode === 409) {
      return reply.status(409).send({
        error: "CPF_ALREADY_HAS_TICKET",
        message: "Já existe um ingresso cadastrado neste CPF.",
      });
    }
    if (error instanceof appError && error.statusCode === 500) {
      request.log.error(
        { error: error.name, message: error.message },
        "Falha ao criar o link de pagamento.",
      );
      return reply.status(500).send({
        error: "PAYMENT_LINK_CREATION_FAILED",
        message: "Falha ao criar o link de pagamento.",
      });
    }
    request.log.error(
      { error: error.name, message: error.message },
      "Erro interno do servidor:",
    );
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
    request.log.info(
      {
        order_nsu: request.body.order_nsu,
      },
      "Pagamento confirmado com sucesso para o pedido:",
    );
    return reply.status(200);
  } catch (error) {
    if (error instanceof appError) {
      request.log.error(
        {
          order_nsu: request.body.order_nsu,
        },
        "Falha ao confirmar o pagamento para o pedido:",
      );
      return reply.status(400);
    }

    request.log.error(
      {
        order_nsu: request.body.order_nsu,
      },
      "Erro interno do servidor ao confirmar o pagamento para o pedido:",
    );
    return reply.status(500);
  }
};

export async function getDbTicketById(userCPF: string) {
  const ticket = await getTicketByCPF(userCPF);
  return ticket;
}
