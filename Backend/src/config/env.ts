import dotenv from "dotenv";

dotenv.config();

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
  betterAuthUrl: required("BETTER_AUTH_URL"),
  port: Number(process.env.PORT) || 4000,
  ticketPriceCents: Number(required("TICKET_PRICE_CENTS")),
  apiBaseUrl: required("API_BASE_URL"),
  trustedOrigins: required("TRUSTED_ORIGINS")
    .split(",")
    .map((origin) => origin.trim()),
};
