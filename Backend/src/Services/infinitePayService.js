import axios from "axios";
import { env } from "../config/env.ts"

export async function createPaymentLink(userData) {
    const response = await axios.post("https://api.checkout.infinitepay.io/links", {
            "handle": env.infinitePayHandle,
            "items": [
                {
                    "quantity": 1,
                    "price": env.ticketPriceCents,
                    "description": "Ingresso Arapuca"
                }
            ],
            "order_nsu": userData.userCPF,
            "customer": {
                "name": userData.userName,
                "email": userData.userEmail,
                "phone_number": userData.userPhone
            },
            "webhook_url": "https://rebuff-engaging-devotedly.ngrok-free.dev/api/webhook-infinitepay"
    }).catch(function (error) {
        if (error.response) {
            console.log(error.response.data);
            console.log(error.response.status);
            console.log(error.response.headers);
        }
    })
    return response.data;
}