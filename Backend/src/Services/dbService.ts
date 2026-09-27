import fastify from "../app.js"
import crypto from "crypto"
import shortid from "shortid"
import { userReceivedInfo } from "../types/internalDataTypes.js"
import { infinitePayCallbackData } from "../types/infinitePayTypes.js"

export const createInvoice = async (payloadData: userReceivedInfo) => {
    const invoice = await fastify.prisma.ticket.create({
        data: {
            confirmationId: shortid.generate(),
            ticketName: payloadData.userName,
            ticketCPF: payloadData.userCPF,
            ticketPhoneNumber: payloadData.userPhone,
            ticketEmail: payloadData.userEmail,
            paymentConfirmed: false,
            valid: false
        }
    })
}

export const confirmPayment = async (payloadData: infinitePayCallbackData) => {
    console.log(payloadData.order_nsu)
    const ticket = await fastify.prisma.ticket.update({
        where: { ticketCPF: payloadData.order_nsu.replace(/\D/g, '') },
        data: { paymentConfirmed: true, valid: true }
    })
}

export const getTicketsByConfirmedStatus = async () => {
    const tickets = await fastify.prisma.ticket.findMany({
        where: {
            paymentConfirmed: true,
            valid: true
        }
    })
    return tickets
}

export const getTicketById = async (userCPF: string) => {
    const tickets = await fastify.prisma.ticket.findUnique({
        where: {
            ticketCPF: userCPF
        }
    })
    if (tickets) {
            return tickets
    }
}