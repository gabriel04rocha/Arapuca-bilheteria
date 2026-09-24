/**
 * Configuração do evento e da bilheteria.
 * Edite os valores abaixo para personalizar o site.
 */
export const CONFIG = {
  evento: {
    data: "10 de outubro de 2026",
    horario: "20h",
    local: "Local a definir",
    cidade: "Cidade a definir",
    valor: 50.0, // valor do ingresso em reais
  },
  pix: {
    chave: "sua-chave-pix@email.com", // chave Pix real (e-mail, CPF/CNPJ, telefone ou aleatória)
    nomeRecebedor: "NOME RECEBEDOR", // até 25 caracteres, sem acentos
    cidadeRecebedor: "CIDADE", // até 15 caracteres, sem acentos
    txid: "ARAPUCA", // identificador da cobranca, sem espacos/acentos
  },
  // nomes que aparecem no menu do passo II
  convidados: [
    "Nome Sobrenome",
    "Nome Sobrenome",
    "Nome Sobrenome",
    "Nome Sobrenome",
    "Nome Sobrenome",
  ],
  convite:
    "Você foi indicado para a primeira edição da Arapuca, compre seu ingresso e prepare-se para uma noite de desande.",
};
