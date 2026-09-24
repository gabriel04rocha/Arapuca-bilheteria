import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

async function createPaymentLink(buyerCPF) {
    console.log(process.env.INFINITE_PAY_HANDLE);
    const response = await axios.post("https://api.checkout.infinitepay.io/links", {
            "handle": process.env.INFINITE_PAY_HANDLE,
            "items": [
                {
                    "quantity": 1,
                    "price": 5000,
                    "description": "Ingresso Arapuca"
                }
            ],
            "order_nsu": buyerCPF
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