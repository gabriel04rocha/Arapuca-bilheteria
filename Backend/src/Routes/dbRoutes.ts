import { FastifyInstance } from "fastify";
import { getDbTicketsByPaymentStatus } from "../Controllers/dbController.js";
import userSignup from "../schemas/userSignup.json" with { type: "json" };

const dbRoutes = (app: FastifyInstance) => {
  app.addSchema(userSignup);

  app.get("/confirmed-guests", getDbTicketsByPaymentStatus);
};

export default dbRoutes;
