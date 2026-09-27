import fastify from "../src/app.js";
import crypto from "crypto";
import shortid from "shortid";

async function main() {
    await fastify.prisma.ticket.createMany({
        data: [
            {
                confirmationId: shortid.generate(),
                ticketName: "Gabriel Rocha",
                ticketCPF: "06972085160",
                ticketPhoneNumber: "61982403742",
                ticketEmail: "gabriel04asr@gmail.com",
                createdAt: new Date(),
                paymentConfirmed: true,
                valid: true
            },
            {
                confirmationId: shortid.generate(),
                ticketName: "Lucas Almeida",
                ticketCPF: "12345678901",
                ticketPhoneNumber: "61987654321",
                ticketEmail: "lucas.almeida@example.com",
                createdAt: new Date(),
                paymentConfirmed: false,
                valid: false
            },
            {
                confirmationId: shortid.generate(),
                ticketName: "Mariana Souza",
                ticketCPF: "23456789012",
                ticketPhoneNumber: "61991234567",
                ticketEmail: "mariana.souza@example.com",
                createdAt: new Date(),
                paymentConfirmed: true,
                valid: true
            },
            {
                confirmationId: shortid.generate(),
                ticketName: "Pedro Henrique",
                ticketCPF: "34567890123",
                ticketPhoneNumber: "61999876543",
                ticketEmail: "pedro.henrique@example.com",
                createdAt: new Date(),
                paymentConfirmed: false,
                valid: false
            },
            {
                confirmationId: shortid.generate(),
                ticketName: "Ana Clara Martins",
                ticketCPF: "45678901234",
                ticketPhoneNumber: "61992345678",
                ticketEmail: "ana.clara@example.com",
                createdAt: new Date(),
                paymentConfirmed: true,
                valid: true
            },
            {
                confirmationId: shortid.generate(),
                ticketName: "Rafael Oliveira",
                ticketCPF: "56789012345",
                ticketPhoneNumber: "61993456789",
                ticketEmail: "rafael.oliveira@example.com",
                createdAt: new Date(),
                paymentConfirmed: false,
                valid: false
            },
            {
                confirmationId: shortid.generate(),
                ticketName: "Juliana Costa",
                ticketCPF: "67890123456",
                ticketPhoneNumber: "61994567890",
                ticketEmail: "juliana.costa@example.com",
                createdAt: new Date(),
                paymentConfirmed: true,
                valid: true
            },
            {
                confirmationId: shortid.generate(),
                ticketName: "Matheus Santos",
                ticketCPF: "78901234567",
                ticketPhoneNumber: "61995678901",
                ticketEmail: "matheus.santos@example.com",
                createdAt: new Date(),
                paymentConfirmed: false,
                valid: false
            },
            {
                confirmationId: shortid.generate(),
                ticketName: "Beatriz Ferreira",
                ticketCPF: "89012345678",
                ticketPhoneNumber: "61996789012",
                ticketEmail: "beatriz.ferreira@example.com",
                createdAt: new Date(),
                paymentConfirmed: true,
                valid: true
            },
            {
                confirmationId: shortid.generate(),
                ticketName: "João Victor Lima",
                ticketCPF: "90123456789",
                ticketPhoneNumber: "61997890123",
                ticketEmail: "joao.victor@example.com",
                createdAt: new Date(),
                paymentConfirmed: false,
                valid: false
            }
        ]
    });

    console.log("Seed executado com sucesso!");
}

main()
    .catch((error) => {
        console.error("Erro ao executar seed:", error);
        process.exit(1);
    })
    .finally(async () => {
        await fastify.prisma.$disconnect();
    });