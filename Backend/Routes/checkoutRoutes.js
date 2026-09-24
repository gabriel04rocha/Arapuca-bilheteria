import getPaymentLink from "../Controllers/checkoutController.js" 

async function checkoutRoutes(app) {
    app.post('/pagamento', async (request, reply) => {
        const paymentLink = await getPaymentLink(request.body);
        console.log(request.body)
        return paymentLink
    })
}

export default checkoutRoutes
