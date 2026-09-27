import { FastifyInstance } from "fastify";
import { getDbTicketById } from "../Controllers/checkoutController.js";
import { getDbTicketsByPaymentStatus } from "../Controllers/dbController.js";

const dbRoutes = (app: FastifyInstance) => {
    app.get('/confirmed-guests', async (request, reply) => {
        return await getDbTicketsByPaymentStatus();
    })

    app.get<{ Querystring: { userCPF: string } }>('/tickets', async (request, reply) => {
        return await getDbTicketById(request.query.userCPF);
    })
}

export default dbRoutes;
