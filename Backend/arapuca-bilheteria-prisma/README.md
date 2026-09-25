# arapuca-bilheteria-prisma

A minimal Prisma 8 monorepo with Turborepo and a plain Node.js HTTP server.

## Workspace layout

- `apps/server` — Hello World server; `/users` reads from the shared database package
- `packages/database` — Prisma contract, generated artifacts, runtime client, and seed data
- `module.ts` and `service.ts` — Composer deployment topology

## Run locally

```bash
npm run dev:composer
```

This builds the workspace and starts it with Composer. PostgreSQL projects get a local Prisma Postgres database and apply the committed migrations automatically.

## Deploy

```bash
npm run deploy
```

The deploy script builds the server with tsdown, provisions Prisma Postgres when selected, applies migrations, and deploys the server to Prisma Compute.

The home page returns `Hello World!` without querying the database. Visiting `/users` queries the shared Prisma package and inserts starter users idempotently from `packages/database/src/seed.ts`.


## Prisma

- Contract: `packages/database/src/contract.prisma`
- Prisma and Composer config: `prisma.config.ts`
- Composer app: `module.ts` and `service.ts`

After changing the contract, run:

```bash
npm run contract:emit
```

To run the workspace's development tasks directly, use `npm run dev`. This direct mode requires `DATABASE_URL`.
