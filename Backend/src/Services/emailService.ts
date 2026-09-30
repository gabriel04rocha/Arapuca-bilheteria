import { Resend } from "resend";
import { env } from "../config/env.js";
import { EmailSendingError } from "../errors/EmailSendingError.js";
import { ticketTemplate } from "../assets/ticketTemplate.js";

export async function sendEmailToBuyer(
  buyerEmail: string,
  confirmationCode: string,
) {
  const resend = new Resend(env.ResendApiKey);
  const { data, error } = await resend.emails.send({
    from: "Ar4puca <contato@ar4puca.com.br>",
    to: [buyerEmail],
    subject: "Seu pagamento foi confirmado. Prepare-se para o desande.",
    html: `<div style="
      max-width: 600px;
      margin: 0 auto;
      font-family: Arial, sans-serif;
      text-align: center;
      background-color: black;
      color: white;
      padding: 30px;
      border-radius: 20px;
      box-shadow: 0 0 3 30px black;
    ">
      <img
        src="https://www.ar4puca.com.br/logo.png"
        alt="Arapuca"
        width="300"
        style="display: block; margin: 0 auto 30px;"
      />

      <h1 style="font-size: 45px">Ingresso confirmado.</h1>

      <p>
        Seu pagamento foi confirmado. Seu ingresso está anexado, pronto para confirmar a sua entrada na <span style="font-weight: bold; color: #7a0014">ARAPUCA</span>. Boa sorte.
      </p>

      <p>
        Apresente o código abaixo na portaria para confirmar a sua entrada.
      </p>

      <p>
        <strong>Código:</strong> ${confirmationCode}
      </p>
    </div>`,
    attachments: [
      {
        filename: `ingresso-Arapuca.jpg`,
        content: ticketTemplate.toString("base64"),
      },
    ],
  });

  if (error) {
    throw new EmailSendingError({
      name: "EMAIL_COULD_NOT_BE_SENT",
      statusCode: 500,
      message: "Houve um erro ao enviar o e-mail.",
    });
  }
}
