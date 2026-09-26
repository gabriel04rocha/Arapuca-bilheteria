import { getTicketsByConfirmedStatus } from "../Services/dbService.js"

export const getDbTicketsByPaymentStatus = async () => {
    const tickets = await getTicketsByConfirmedStatus();
    return tickets;
}