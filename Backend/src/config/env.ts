export const env = {
    databaseUrl: process.env.DATABASE_URL!,
    betterAuthSecret: process.env.BETTER_AUTH_SECRET!,
    infinitePayHandle: process.env.INFINITEPAY_HANDLE!,
    port: process.env.PORT!,
    ticketPriceCents: Number(process.env.TICKET_PRICE_CENTS)
}