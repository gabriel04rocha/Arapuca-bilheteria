import sharp from "sharp";
import { TicketGenerationError } from "../errors/TicketGenerationError.js";
import { ticketTemplate } from "../assets/ticketTemplate.js";

export async function generateTicket(confirmationID: string) {
  try {
    const textSvg = `
    <svg width="1080px" height="1920px">

    <style>
        .code {
            font-family: "Arial Black";
            font-size: 42px;
            font-weight: black;
        }
    </style>
        <text
            x="540"
            y="1390"
            text-anchor="middle"
            class="code"
        >
            ${confirmationID}
        </text>
    </svg>
    `;

    return await sharp(ticketTemplate)
      .composite([
        {
          input: Buffer.from(textSvg),
        },
      ])
      .jpeg()
      .toBuffer();
  } catch (error: any) {
    throw new TicketGenerationError({
      name: "COULD_NOT_GENERATE_TICKET",
      statusCode: 500,
      message: `Houve um erro ao gerar o ingresso: ${error.message}`,
    });
  }
}
