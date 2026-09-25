import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

async function createPaymentLink(userData) {
    console.log(process.env.INFINITE_PAY_HANDLE);
    const response = await axios.post("https://api.checkout.infinitepay.io/links", {
            "handle": process.env.INFINITE_PAY_HANDLE,
            "items": [
                {
                    "quantity": 1,
                    "price": process.env.TICKET_PRICE,
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

export default createPaymentLink;