import { confirmPayment, createInvoice, getTicketById } from "../Services/dbService.js";
import { createPaymentLink } from "../Services/infinitePayService.js"

export async function getPaymentLink(userData) {
    const paymentLink = await createPaymentLink(userData);
    return paymentLink;
}

export async function createDbInvoice(payloadData) {
    const invoiceCreated = createInvoice(payloadData);
    return invoiceCreated
};

export async function confirmDbPayment(payloadData) {
    const paymentConfirmed = confirmPayment(payloadData);
    return paymentConfirmed
}

export async function getDbTicketById(userCPF) {
    const ticket = getTicketById(userCPF);
    return ticket;
}