import { confirmPayment, createInvoice, getTicketById } from "../Services/dbService.js";
import { createPaymentLink } from "../Services/infinitePayService.js"
import type { userReceivedInfo } from "../types/internalDataTypes.js"
import type { infinitePayCallbackData } from "../types/infinitePayTypes.js"

export async function getPaymentLink(userData: userReceivedInfo) {
    const paymentLink = await createPaymentLink(userData);
    return paymentLink;
}

export async function createDbInvoice(payloadData: userReceivedInfo) {
    const invoiceCreated = await createInvoice(payloadData);
    return invoiceCreated
};

export async function confirmDbPayment(payloadData: infinitePayCallbackData) {
    const paymentConfirmed = await confirmPayment(payloadData);
    return paymentConfirmed
}

export async function getDbTicketById(userCPF: string) {
    const ticket = await getTicketById(userCPF);
    return ticket;
}