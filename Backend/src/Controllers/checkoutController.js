import createPaymentLink from "../Services/infinitePayService.js";

async function getPaymentLink(userData) {
    const paymentLink = await createPaymentLink(userData);
    return paymentLink;
}

export default getPaymentLink;