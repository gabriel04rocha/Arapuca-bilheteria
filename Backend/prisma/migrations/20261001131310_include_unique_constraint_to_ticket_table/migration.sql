-- 1. Adiciona temporariamente permitindo NULL
ALTER TABLE "Ticket" ADD COLUMN "customerCPF" TEXT;

--2. Copia o CPF da Invoice correspondente
UPDATE "Ticket" t
SET "customerCPF" = i."customerCPF"
from "Invoice" i
WHERE t."invoiceId" = i."id";

--3. Agora que todos os Tickets existentes foram preenchidos,
--   tranforma a coluna em NOT NULL

ALTER TABLE "Ticket"
ALTER COLUMN "customerCPF" SET NOT NULL;

-- 4. Finalmente cria o UNIQUE
CREATE UNIQUE INDEX "Ticket_customerCPF_key"
ON "Ticket"("customerCPF");
