import axios from "axios";
import { env } from "../config/env.js";
import { userReceivedInfo } from "../types/internalDataTypes.js";
import ipPaymentLinkSchema from "../schemas/infinitePayPaymentLink.json" with { type: "json" };
import { createRequire } from "node:module";
import Ajv from "ajv/dist/ajv.js";

type CreatePaymentLinkResponse = {
  url: string;
};

export async function createPaymentLink(
  userData: userReceivedInfo,
  orderNsu: string,
): Promise<CreatePaymentLinkResponse> {
  const require = createRequire(import.meta.url);

  const Ajv = require("ajv");

  const validate = Ajv.compile(ipPaymentLinkSchema);

  const response = await axios
    .post<CreatePaymentLinkResponse>(
      "https://api.checkout.infinitepay.io/links",
      {
        handle: env.infinitePayHandle,
        items: [
          {
            quantity: 1,
            price: env.ticketPriceCents,
            description: "Ingresso Arapuca",
          },
        ],
        order_nsu: orderNsu,
        customer: {
          name: userData.userName,
          email: userData.userEmail,
          phone_number: userData.userPhone,
        },
        webhook_url:
          "https://rebuff-engaging-devotedly.ngrok-free.dev/api/webhook-infinitepay",
      },
    )
    .catch(function (error) {
      throw Error(error.message);
    });

  if (!validate(response.data)) {
    throw new Error("Formato de resposta da Infinite Pay inválido.");
  }

  return response.data;
}
