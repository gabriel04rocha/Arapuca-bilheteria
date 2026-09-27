import fastify from "../app.mjs"
import shortid from "shortid"

export const createInvoice = async (payloadData) => {
    const invoice = await fastify.prisma.ticket.create({
        data: {
            id: shortid.generate(),
            ticketName: payloadData.userName,
            ticketCPF: payloadData.userCPF,
            ticketPhoneNumber: payloadData.userPhone,
            ticketEmail: payloadData.userEmail,
            createdAt: new Date(Date.now()),
            paymentConfirmed: false,
            valid: false
        }
    })
}

export const confirmPayment = async (payloadData) => {
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

export const getTicketById = async (userCPF) => {
    const tickets = await fastify.prisma.ticket.findUnique({
        where: {
            ticketCPF: userCPF
        }
    })
    if (tickets) {
            return tickets
    }
}