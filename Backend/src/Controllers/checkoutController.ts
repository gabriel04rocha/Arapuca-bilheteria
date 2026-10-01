import {
  confirmInvoicePayment,
  createInvoice,
  getTicketByCPF,
} from "../Services/dbService.js";
import { createPaymentLink } from "../Services/infinitePayService.js";
import type { userReceivedInfo } from "../types/internalDataTypes.js";
import type { infinitePayCallbackData } from "../types/infinitePayTypes.js";
import crypto from "crypto";
import { AppError } from "../errors/AppError.js";
import { FastifyReply, FastifyRequest } from "fastify";
import { generateTicket } from "../Services/ticketService.js";
import { sendEmailToBuyer } from "../Services/emailService.js";
import { TicketGenerationError } from "../errors/TicketGenerationError.js";
import { EmailSendingError } from "../errors/EmailSendingError.js";

export const getPaymentLink = async (
  request: FastifyRequest<{
    Body: userReceivedInfo;
  }>,
  reply: FastifyReply,
) => {
  try {
    const existingTicket = await getTicketByCPF(request.body.userCPF);

    if (existingTicket) {
      throw new AppError({
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
      throw new AppError({
        name: "PAYMENT_LINK_CREATION_FAILED",
        statusCode: 500,
        message: "Falha ao criar o link de pagamento.",
      });
    }
  } catch (error: AppError | Error | any) {
    if (error instanceof AppError && error.statusCode === 409) {
      return reply.status(409).send({
        error: "CPF_ALREADY_HAS_TICKET",
        message: "Já existe um ingresso cadastrado neste CPF.",
      });
    }
    if (error instanceof AppError && error.statusCode === 500) {
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
    const ticketInfo = await confirmInvoicePayment(request.body);
    await sendEmailToBuyer(ticketInfo.buyerEmail, ticketInfo.confirmationID);
    request.log.info(
      {
        order_nsu: request.body.order_nsu,
      },
      "Pagamento confirmado com sucesso para o pedido:",
    );
    return reply.status(200).send();
  } catch (error) {
    if (error instanceof AppError) {
      if (error.name === "TICKET_ALREADY_EXISTS") {
        request.log.error(
          `Já existe um ingresso com esse identificador no banco de dados.`,
        );
        return reply.status(200).send();
      }
      request.log.error(
        `Falha ao confirmar o pagamento para o pedido: ${error.name}`,
      );
      return reply.status(400).send();
    }

    if (error instanceof TicketGenerationError) {
      request.log.error(`Houve erro ao gerar o ingresso: ${error.message}`);
      return reply.status(500).send({
        error: "INTERNAL_SERVER_ERROR",
        message: "Erro interno do servidor.",
      });
    }

    if (error instanceof EmailSendingError) {
      request.log.error("Houve erro ao enviar o e-mail para o comprador.");
      return reply.status(500).send({
        error: "INTERNAL_SERVER_ERROR",
        message: "Erro interno do servidor.",
      });
    }

    request.log.error(
      {
        order_nsu: request.body.order_nsu,
      },
      "Erro interno do servidor ao confirmar o pagamento para o pedido:",
    );
    return reply.status(500).send();
  }
};

export async function getDbTicketById(userCPF: string) {
  const ticket = await getTicketByCPF(userCPF);
  return ticket;
}
