import { getDbTicketsByPaymentStatus } from "../Controllers/dbController.js";

const dbRoutes = (app) => {
    app.get('/confirmed-guests', async (request, reply) => {
        return await getDbTicketsByPaymentStatus()
    })
}

export default dbRoutes;
