import createPaymentLink from "../Services/infinitePayService.js";

async function getPaymentLink(userCPF) {
    const paymentLink = await createPaymentLink(userCPF);
    return paymentLink;
}

export default getPaymentLink;