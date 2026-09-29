import fastify from "../app.js";
import shortid from "shortid";
import type { userReceivedInfo } from "../types/internalDataTypes.js";
import { infinitePayCallbackData } from "../types/infinitePayTypes.js";
import { env } from "../config/env.js";
import { appError } from "../errors/appError.js";
import { dbError } from "../errors/dbError.js";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/client";

export const createInvoice = async (
  payloadData: userReceivedInfo,
  orderNsu: string,
) => {
  try {
    await fastify.prisma.invoice.create({
      data: {
        price: env.ticketPriceCents,
        orderNsu: orderNsu,
        customerName: payloadData.userName,
        customerCPF: payloadData.userCPF,
        customerPhoneNumber: payloadData.userPhone,
        customerEmail: payloadData.userEmail,
        paymentConfirmed: false,
      },
    });
  } catch (error) {
    if (
      error instanceof PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      throw new appError({
        name: "INVOICE_ALREADY_EXISTS",
        message: "Já existe um pedido com um dos identificadores informados.",
        statusCode: 409,
      });
    }

    throw error;
  }
};

export const confirmInvoicePayment = async (
  payloadData: infinitePayCallbackData,
) => {
  await fastify.prisma.$transaction(async (prisma) => {
    const invoice = await prisma.invoice.findUnique({
      where: { orderNsu: payloadData.order_nsu },
    });

    if (!invoice) {
      throw new appError({
        name: "INVOICE_NOT_FOUND",
        statusCode: 404,
        message: "Não foi encontrada uma invoice para este pedido.",
      });
    }

    if (invoice.price !== payloadData.amount) {
      throw new appError({
        name: "INVALID_PAYMENT_AMOUNT",
        statusCode: 400,
        message:
          "O valor de pagamento diverge do valor da invoice selecionada.",
      });
    }

    if (invoice.paymentConfirmed) {
      const ticket = await prisma.ticket.findUnique({
        where: { invoiceId: invoice.id },
      });

      if (ticket && invoice.transactionNsu === payloadData.transaction_nsu) {
        return;
      }
    }

    const updatedInvoice = await prisma.invoice.update({
      where: { orderNsu: payloadData.order_nsu },
      data: { paymentConfirmed: true },
    });

    try {
      await prisma.ticket.create({
        data: {
          confirmationId: shortid.generate(),
          invoiceId: updatedInvoice.id,
          valid: true,
        },
      });
    } catch (error) {
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === "P2002"
      ) {
        throw new appError({
          name: "TICKET_ALREADY_EXISTS",
          statusCode: 409,
          message: "Já existe um ingresso cadastrado neste CPF.",
        });
      }
    }
  });
};

export const getTicketsByConfirmedStatus = async () => {
  const tickets = await fastify.prisma.ticket.findMany({
    where: {
      invoice: {
        paymentConfirmed: true,
      },
    },
    select: {
      id: true,
      confirmationId: true,
      valid: true,

      invoice: {
        select: {
          customerName: true,
          customerCPF: true,
          customerPhoneNumber: true,
          customerEmail: true,
        },
      },
    },
  });

  if (!tickets) {
    throw new dbError({
      name: "TICKETS_NOT_FOUND",
      statusCode: 404,
      message: "Não foram encontrados ingressos confirmados.",
    });
  }

  return tickets;
};

export const getInvoiceByCPF = async (userCPF: string) => {
  const tickets = await fastify.prisma.invoice.findUnique({
    where: {
      customerCPF: userCPF,
    },
  });
  if (tickets) {
    return tickets;
  }
};

export const getInvoiceById = async (orderNsu: string) => {
  const tickets = await fastify.prisma.invoice.findUnique({
    where: {
      orderNsu: orderNsu,
    },
  });
  if (tickets) {
    return tickets;
  }
};

export const getTicketByCPF = async (userCPF: string) => {
  const tickets = await fastify.prisma.ticket.findFirst({
    where: {
      invoice: {
        customerCPF: userCPF,
      },
    },
  });
  if (tickets) {
    return tickets;
  }
};
