import getPaymentLink from "../Controllers/checkoutController.js" 

async function checkoutRoutes(app, options) {
    app.post('/pagamento', async (request, reply) => {
        const paymentLink = await getPaymentLink(request.body.data.userCPF);
        return paymentLink
    })
}

export default checkoutRoutes
