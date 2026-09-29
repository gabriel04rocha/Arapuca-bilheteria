import axios from "axios";
import { env } from "../config/env.js";
import { userReceivedInfo } from "../types/internalDataTypes.js";

type CreatePaymentLinkResponse = {
  url: string;
};

export async function createPaymentLink(
  userData: userReceivedInfo,
  orderNsu: string,
): Promise<CreatePaymentLinkResponse> {
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
        webhook_url: env.apiBaseUrl + "/api/infinite-pay-webhook",
      },
    )
    .catch(function (error) {
      throw Error(error.message);
    });

  return response.data;
}
