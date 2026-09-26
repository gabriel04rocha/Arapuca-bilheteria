import {getPaymentLink, createDbInvoice, confirmDbPayment } from "../Controllers/checkoutController.js" 

async function checkoutRoutes(app) {
    app.post('/pagamento', async (request, reply) => {
        const paymentLink = await getPaymentLink(request.body);
        createDbInvoice(request.body)
        return paymentLink
    })

    app.post('/webhook-infinitepay', async (request, reply) => {
        confirmDbPayment(request.body);
    })
}

export default checkoutRoutes
