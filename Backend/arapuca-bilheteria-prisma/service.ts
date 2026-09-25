import node from "@prisma/composer/node";
import { compute } from "@prisma/composer-prisma-cloud";
import { postgres } from "@prisma/composer-prisma-cloud/orm";

import { appContract } from "./packages/database/src/composer.ts";

export default compute({
  name: "app",
  deps: {
    database: postgres(appContract),
  },
  build: node({ module: import.meta.url, entry: "./apps/server/dist/server.mjs" }),
});
