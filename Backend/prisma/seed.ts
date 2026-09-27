import crypto from "crypto";
import shortid from "shortid";
import { prisma } from "../src/lib/prisma.js";

async function main() {
  const tickets = [
    {
      name: "Gabriel Rocha",
      cpf: "06972085160",
      phone: "61982403742",
      email: "gabriel04asr@gmail.com",
      price: 1000,
      paymentConfirmed: true,
    },
    {
      name: "Lucas Almeida",
      cpf: "12345678901",
      phone: "61987654321",
      email: "lucas.almeida@example.com",
      price: 1000,
      paymentConfirmed: false,
    },
    {
      name: "Mariana Souza",
      cpf: "23456789012",
      phone: "61991234567",
      email: "mariana.souza@example.com",
      price: 1000,
      paymentConfirmed: true,
    },
    {
      name: "Pedro Henrique",
      cpf: "34567890123",
      phone: "61999876543",
      email: "pedro.henrique@example.com",
      price: 1000,
      paymentConfirmed: false,
    },
    {
      name: "Ana Clara Martins",
      cpf: "45678901234",
      phone: "61992345678",
      email: "ana.clara@example.com",
      price: 1000,
      paymentConfirmed: true,
    },
    {
      name: "Rafael Oliveira",
      cpf: "56789012345",
      phone: "61993456789",
      email: "rafael.oliveira@example.com",
      price: 1000,
      paymentConfirmed: false,
    },
    {
      name: "Juliana Costa",
      cpf: "67890123456",
      phone: "61994567890",
      email: "juliana.costa@example.com",
      price: 1000,
      paymentConfirmed: true,
    },
    {
      name: "Matheus Santos",
      cpf: "78901234567",
      phone: "61995678901",
      email: "matheus.santos@example.com",
      price: 1000,
      paymentConfirmed: false,
    },
    {
      name: "Beatriz Ferreira",
      cpf: "89012345678",
      phone: "61996789012",
      email: "beatriz.ferreira@example.com",
      price: 1000,
      paymentConfirmed: true,
    },
    {
      name: "João Victor Lima",
      cpf: "90123456789",
      phone: "61997890123",
      email: "joao.victor@example.com",
      price: 1000,
      paymentConfirmed: false,
    },
  ];

  for (const data of tickets) {
    const invoice = await prisma.invoice.create({
      data: {
        price: data.price,

        orderNsu: shortid.generate(),

        customerName: data.name,
        customerCPF: data.cpf,
        customerPhoneNumber: data.phone,
        customerEmail: data.email,

        paymentConfirmed: data.paymentConfirmed,

        ...(data.paymentConfirmed && {
          invoiceSlug: `invoice-${shortid.generate()}`,
          transactionNsu: crypto.randomUUID(),
          receiptUrl: `https://example.com/receipt/${shortid.generate()}`,

          ticket: {
            create: {
              confirmationId: shortid.generate(),
              valid: true,
            },
          },
        }),
      },

      include: {
        ticket: true,
      },
    });

    console.log(
      `Invoice criada: ${invoice.id} | ` +
        `${data.name} | ` +
        `Pagamento: ${data.paymentConfirmed ? "CONFIRMADO" : "PENDENTE"} | ` +
        `Ticket: ${invoice.ticket ? "CRIADO" : "NÃO CRIADO"}`,
    );
  }

  console.log("Seed executado com sucesso!");
}

main()
  .catch((error) => {
    console.error("Erro ao executar seed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
