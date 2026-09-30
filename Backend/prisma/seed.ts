import crypto from "crypto";
import shortid from "shortid";
import { prisma } from "../src/lib/prisma.js";

async function main() {
  const tickets = [
    {
      name: "Gabriel Rocha",
      cpf: "00000000000",
      phone: "61982403742",
      email: "gabriel.teste@example.com",
      price: 1000,
      paymentConfirmed: true,
    },
    {
      name: "Lucas Teste",
      cpf: "111111111111",
      phone: "61987654321",
      email: "lucas.teste@example.com",
      price: 1000,
      paymentConfirmed: false,
    },
    {
      name: "Mariana Teste",
      cpf: "222222222222",
      phone: "61991234567",
      email: "mariana.souza@example.com",
      price: 1000,
      paymentConfirmed: true,
    },
    {
      name: "Pedro Henrique",
      cpf: "333333333333",
      phone: "61999876543",
      email: "pedro.henrique@example.com",
      price: 1000,
      paymentConfirmed: false,
    },
    {
      name: "Ana Clara Teste",
      cpf: "444444444444",
      phone: "61992345678",
      email: "ana.clara@example.com",
      price: 1000,
      paymentConfirmed: true,
    },
    {
      name: "Rafael Teste",
      cpf: "555555555555",
      phone: "61993456789",
      email: "rafael.teste@example.com",
      price: 1000,
      paymentConfirmed: false,
    },
    {
      name: "Juliana Teste",
      cpf: "666666666666",
      phone: "61994567890",
      email: "juliana.teste@example.com",
      price: 1000,
      paymentConfirmed: true,
    },
    {
      name: "Matheus Teste",
      cpf: "777777777777",
      phone: "61995678901",
      email: "matheus.teste@example.com",
      price: 1000,
      paymentConfirmed: false,
    },
    {
      name: "Beatriz Ferreira",
      cpf: "888888888888",
      phone: "61996789012",
      email: "beatriz.teste@example.com",
      price: 1000,
      paymentConfirmed: true,
    },
    {
      name: "João Victor Teste",
      cpf: "999999999999",
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
              confirmationId:
                "ARAPUCA-" +
                crypto
                  .randomBytes(6)
                  .toString("hex")
                  .toUpperCase()
                  .match(/.{1,4}/g)!
                  .join("-"),
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
