import { getTicketsByConfirmedStatus } from "../Services/dbService.js";
import { userReceivedInfo } from "../types/internalDataTypes.js";
import { createInvoice } from "../Services/dbService.js";
import { dbError } from "../errors/dbError.js";
import fastify, { FastifyReply, FastifyRequest } from "fastify";
import { auth } from "../lib/auth.js";
import { appError } from "../errors/appError.js";
import { fromNodeHeaders } from "better-auth/node";

type guestTicketInformation = {
  id: string;
  confirmationId: string;
  valid: boolean;
  name: string;
  phone: string;
};

export const getDbTicketsByPaymentStatus = async (
  request: FastifyRequest,
  reply: FastifyReply,
) => {
  try {
    const session = await auth.api.getSession({
      headers: fromNodeHeaders(request.headers),
    });

    console.log("antes de TUDO!");
    const { success } = await auth.api.userHasPermission({
      body: {
        userId: session?.user.id,
        permissions: { project: ["read_guests"] },
      },
    });

    if (!success) {
      throw new appError({
        name: "USER_DOES_NOT_HAVE_PERMISSION",
        message:
          "O usuário logado não possui permissão para acessar este recurso.",
        statusCode: 401,
      });
    }

    const tickets = await getTicketsByConfirmedStatus();
    const ticketsToSend: guestTicketInformation[] = tickets.map(
      ({ id, confirmationId, invoice, valid }) => ({
        id: id,
        confirmationId: confirmationId,
        name: invoice.customerName,
        phone: invoice.customerPhoneNumber,
        valid: valid,
      }),
    );

    return reply.status(200).send(ticketsToSend);
  } catch (error) {
    if (error instanceof appError) {
      return reply
        .status(401)
        .send({ error: error.name, message: error.message });
    }

    if (error instanceof dbError) {
      return reply
        .status(404)
        .send({ error: error.name, message: error.message });
    }

    return reply.status(500).send({
      error: "INTERNAL_SERVER_ERROR",
      message: "Erro interno do servidor.",
    });
  }
};
