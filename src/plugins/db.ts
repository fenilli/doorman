import fp from "fastify-plugin";

import { config } from "@/config/index.js";
import { createDatabase } from "@/database/index.js";

declare module "fastify" {
  interface FastifyInstance {
    db: ReturnType<typeof createDatabase>;
  }
}

export const dbPlugin = fp((server) => {
  const db = createDatabase({
    connectionString: config.database.url,
  });

  server.decorate("db", db);

  server.addHook("onClose", async (instance) => {
    await instance.db.destroy();
  });
}, { name: "db-plugin" });
