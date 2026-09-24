import fastify from "fastify";
import checkoutRoutes from "./Routes/checkoutRoutes.js";
import cors from "@fastify/cors"
import dotenv from "dotenv"
import fastifyPlugin from 'fastify-plugin';

dotenv.config()

export async function buildApp(options = {}) {
    const app = fastify(options);

    await app.register(cors, {
    origin: process.env.FRONTEND_URL,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
  });

    app.get('/health', async (req, res) => {
        return {
            "status": 'OK',
            "message": "API rodando com Fastify!"
        }
    })

    await app.register(checkoutRoutes, { prefix: 'api' })

    return app;
}