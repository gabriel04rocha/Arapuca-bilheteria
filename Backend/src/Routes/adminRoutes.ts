import { FastifyInstance } from "fastify";
import { sendEmail } from "../Controllers/adminController.js";
import sendEmailSchema from "../schemas/sendEmail.json" with { type: "json" };

function adminRoutes(app: FastifyInstance) {
  app.addSchema(sendEmailSchema);
  app.post(
    "/send-email",
    {
      schema: {
        body: {
          $ref: "sendEmailSchema#",
        },
      },
    },
    sendEmail,
  );
}

export default adminRoutes;
