# Arapuca, bilheteria online

Site de bilheteria em Next.js (App Router): o cliente gera o código Pix, paga,
escolhe o nome dele numa lista e anexa o comprovante. Cada envio cai numa
lista que atualiza sozinha na página.

## Antes de usar

Edite `lib/config.ts`:

- `evento`: data, horário, local, cidade e valor do ingresso
- `pix`: sua chave Pix real, o nome e a cidade do recebedor (como aparecem
  na conta bancária) e um identificador (txid)
- `convidados`: a lista de nomes que aparece no passo II
- `convite`: o texto de chamada exibido abaixo da logo

## Como os dados são guardados

- Os comprovantes (arquivos) são salvos em `public/uploads/`
- Os metadados de cada envio (nome, data, arquivo) ficam em `data/comprovantes.json`
- Essas duas pastas precisam de um volume persistente quando rodar em produção,
  senão os comprovantes somem a cada novo deploy do container

## Rodar localmente

```bash
npm install
npm run dev
```

Acesse http://localhost:3000

## Rodar com Docker

```bash
docker build -t arapuca-bilheteria .
docker run -p 3000:3000 \
  -v $(pwd)/data:/app/data \
  -v $(pwd)/public/uploads:/app/public/uploads \
  arapuca-bilheteria
```

Os `-v` acima são o que garante que os comprovantes sobrevivam a um restart
ou a um novo deploy do container. Sem eles, tudo o que for enviado fica só
dentro do container e some quando ele for recriado.
