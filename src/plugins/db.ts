import fp from "fastify-plugin";

import { createDatabase } from "@/database/index.js";

declare module "fastify" {
  interface FastifyInstance {
    db: ReturnType<typeof createDatabase>;
  }
}

export default fp(async (app) => {
  const db = createDatabase({
    host: app.config.DB_HOST,
    port: app.config.DB_PORT,
    database: app.config.DB_DATABASE,
    user: app.config.DB_USER,
    password: app.config.DB_PASSWORD,
  });

  app.decorate("db", db);
  app.addHook("onClose", async (instance) => {
    await instance.db.destroy();
  });
}, { name: "db-plugin" });
