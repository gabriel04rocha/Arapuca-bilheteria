import { organizationClient } from "better-auth/client/plugins";
import dotenv from "dotenv";

dotenv.config();

interface Env {
    databaseURL: string,
    betterAuthSecret: string,
    infinitePayHandle: string,
    port: number,
    ticketPriceCents: number,
    trustedOrigins: string[]
}

function required(name: string): string {
    const value = process.env[name];

    if (!value) {
        throw new Error(`Variável de ambiente ${name} não configurada`);
    }

    return value;
}

export const env = {
    databaseUrl: process.env.DATABASE_URL!,
    betterAuthSecret: process.env.BETTER_AUTH_SECRET!,
    infinitePayHandle: process.env.INFINITEPAY_HANDLE!,
    port: Number(process.env.PORT) || 4000,
    ticketPriceCents: Number(process.env.TICKET_PRICE_CENTS),
    trustedOrigins: required("TRUSTED_ORIGINS").split(',').map(origin => origin.trim())
}