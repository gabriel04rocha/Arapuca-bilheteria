import dotenv from "dotenv";
import fastify from "../fastify.js";

dotenv.config();

fastify.log.info(
  {
    DATABASE_URL: Boolean(process.env.DATABASE_URL),
    BETTER_AUTH_SECRET: Boolean(process.env.BETTER_AUTH_SECRET),
    INFINITE_PAY_HANDLE: Boolean(process.env.INFINITE_PAY_HANDLE),
    TRUSTED_ORIGINS: Boolean(process.env.TRUSTED_ORIGINS),
    TICKET_PRICE_CENTS: Boolean(process.env.TICKET_PRICE_CENTS),
    API_BASE_URL: Boolean(process.env.API_BASE_URL),
  },
  "ENV CHECK:",
);

function required(name: string): string {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Variável de ambiente ${name} não configurada`);
  }

  return value;
}

export const env = {
  databaseUrl: required("DATABASE_URL"),
  betterAuthSecret: required("BETTER_AUTH_SECRET"),
  infinitePayHandle: required("INFINITE_PAY_HANDLE"),
  port: Number(process.env.PORT) || 4000,
  ticketPriceCents: Number(required("TICKET_PRICE_CENTS")),
  apiBaseUrl: required("API_BASE_URL"),
  trustedOrigins: required("TRUSTED_ORIGINS")
    .split(",")
    .map((origin) => origin.trim()),
};
