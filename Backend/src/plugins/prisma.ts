import fp from "fastify-plugin";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { env } from "../config/env.ts"

const prismaPlugin = fp(async (fastify) => {
  const adapter = new PrismaPg({
    connectionString: env.databaseUrl,
  });

  const prisma = new PrismaClient({
    adapter,
  });

  await prisma.$connect();

  fastify.decorate("prisma", prisma);

  fastify.addHook("onClose", async () => {
    await prisma.$disconnect();
  });
});

export default prismaPlugin;