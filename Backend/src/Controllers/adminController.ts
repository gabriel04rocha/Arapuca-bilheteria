import fastify, { FastifyReply, FastifyRequest } from "fastify";
import { sendEmailToBuyer } from "../Services/emailService.js";
import { userEmailInfo } from "../types/internalDataTypes.js";
import { EmailSendingError } from "../errors/EmailSendingError.js";

export const sendEmail = async (
  request: FastifyRequest<{
    Body: userEmailInfo;
  }>,
  reply: FastifyReply,
) => {
  try {
    await sendEmailToBuyer(request.body.email, request.body.confirmationCode);
    return reply.status(200).send();
  } catch (error: EmailSendingError | any) {
    request.log.error(
      "Ocorreu um erro ao enviar o e-mail para o comprador. " + error.message,
    );

    if (error instanceof EmailSendingError) {
      return reply.status(500).send({
        name: "FAILED_TO_SEND_EMAIL",
        message:
          "Ocorreu um erro ao enviar o e-mail para o comprador solicitado",
      });
    }

    return reply.status(500).send({
      name: "INTERNAL_SERVER_ERROR",
      message: "Ocorreu um erro interno do servidor ao enviar o email.",
    });
  }
};
