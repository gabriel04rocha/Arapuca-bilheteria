import { FastifyInstance } from "fastify";
import {
  getDbTicketsByPaymentStatus,
  validateTicket,
} from "../Controllers/dbController.js";
import confirmationID from "../schemas/confirmationIdSchema.json" with { type: "json" };

const dbRoutes = (app: FastifyInstance) => {
  app.addSchema(confirmationID);

  app.get("/confirmed-guests", getDbTicketsByPaymentStatus);

  app.post(
    "/validate-ticket",
    {
      schema: {
        body: {
          $ref: "confirmationIdSchema#",
        },
      },
    },
    validateTicket,
  );
};

export default dbRoutes;
