import {
  getPaymentLink,
  confirmPayment,
} from "../Controllers/checkoutController.js";
import { FastifyInstance } from "fastify";
import infinitePayCallbackDataSchema from "../schemas/infinitePayCallbackData.json" with { type: "json" };
import infinitePayItemSchema from "../schemas/infinitePayItemSchema.json" with { type: "json" };
import invoiceCreationSchema from "../schemas/invoiceCreation.json" with { type: "json" };
import { env } from "../config/env.js";

async function checkoutRoutes(app: FastifyInstance) {
  app.addSchema(infinitePayItemSchema);
  app.addSchema(infinitePayCallbackDataSchema);
  app.addSchema(invoiceCreationSchema);

  app.post(
    "/pagamento",
    {
      schema: {
        body: {
          $ref: "invoiceSchema#",
        },
      },
    },
    getPaymentLink,
  );

  app.post(
    `${env.apiBaseUrl}/webhook-infinitepay`,
    {
      schema: {
        body: {
          $ref: "IPCallbackData#",
        },
      },
    },
    confirmPayment,
  );
}

export default checkoutRoutes;
