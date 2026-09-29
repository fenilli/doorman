import fp from "fastify-plugin";

import { createDatabase } from "@/database/index.js";

declare module "fastify" {
  interface FastifyInstance {
    db: ReturnType<typeof createDatabase>;
  }
}

export const dbPlugin = fp((app) => {
  const db = createDatabase({
    connectionString: app.config.database.url,
  });

  app.decorate("db", db);

  app.addHook("onClose", async (instance) => {
    await instance.db.destroy();
  });
}, { name: "db-plugin" });
