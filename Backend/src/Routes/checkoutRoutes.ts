import {getPaymentLink, createDbInvoice, confirmDbPayment } from "../Controllers/checkoutController.js";
import { FastifyInstance } from "fastify";
import { userReceivedInfo } from "../types/internalDataTypes.js";
import { infinitePayCallbackData } from "../types/infinitePayTypes.js";
import infinitePayCallbackDataSchema from "../schemas/infinitePayCallbackData.json" with { type: "json" };
import infinitePayItemSchema from "../schemas/infinitePayItemSchema.json" with { type: "json" };

async function checkoutRoutes(app: FastifyInstance) {
    app.addSchema(infinitePayItemSchema);
    app.addSchema(infinitePayCallbackDataSchema);

    app.post<{ Body: userReceivedInfo }>('/pagamento', async (request, reply) => {
        const paymentLink = await getPaymentLink(request.body);
        await createDbInvoice(request.body);
        return paymentLink;
    })

    app.post<{ Body: infinitePayCallbackData }>('/webhook-infinitepay', {
        schema: {
            body: {
                "$ref": "IPCallbackData#"
            }
        }
    }, async (request, reply) => {
        console.log("rodou!")
        await confirmDbPayment(request.body);
    })
}

export default checkoutRoutes
