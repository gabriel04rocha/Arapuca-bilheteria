import Fastify from "fastify";
import checkoutRoutes from "./Routes/checkoutRoutes.js";
import cors from "@fastify/cors"
import dotenv from "dotenv"
import prismaPlugin from "./plugins/prisma.ts";
import { userRoutes } from "./Routes/users.ts";
import dbRoutes from "./Routes/dbRoutes.js";

dotenv.config()

const fastify = Fastify({
    logger: true
});

await fastify.register(cors, {
origin: process.env.FRONTEND_URL,
methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
allowedHeaders: ['Content-Type', 'Authorization']
});

await fastify.register(prismaPlugin);

fastify.get('/health', async (req, res) => {
    return {
        "status": 'OK',
        "message": "API rodando com Fastify!"
    }
})

await fastify.register(checkoutRoutes, { prefix: 'api' })
await fastify.register(userRoutes, { prefix: 'api' })
await fastify.register(dbRoutes, { prefix: 'api' })

export default fastify;
