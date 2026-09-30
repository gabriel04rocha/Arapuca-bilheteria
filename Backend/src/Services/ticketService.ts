import sharp from "sharp";
import fs from "node:fs/promises";
import { TicketGenerationError } from "../errors/TicketGenerationError.js";

export async function generateTicket(confirmationID: string) {
  try {
    const font = await fs.readFile(
      "src/assets/fonts/ARCHIVO_EXPANDED-BLACK.TTF",
    );
    const textSvg = `
    <svg width="1300px" height="700px">

    <style>
        .code {
            font-family: "Arial Black";
            font-size: 42px;
            font-weight: black;
        }
    </style>
        <text
            x="650"
            y="420"
            text-anchor="middle"
            font-family="Arial Black"
            font-weight="Black"
            font-size="80px"
        >
            ARPC-
        </text>
        <text
            x="650"
            y="460"
            text-anchor="middle"
            class="code"
        >
            ${confirmationID}
        </text>
    </svg>
    `;

    return await sharp("assets/bilete.png")
      .composite([
        {
          input: Buffer.from(textSvg),
        },
      ])
      .jpeg()
      .toBuffer();
  } catch (error) {
    throw new TicketGenerationError({
      name: "COULD_NOT_GENERATE_TICKET",
      statusCode: 500,
      message: "Houve um erro ao gerar o ingresso.",
    });
  }
}
