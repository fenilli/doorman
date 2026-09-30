import fp from "fastify-plugin";

import { KeysService } from "@/modules/oauth/keys.service.js";

declare module "fastify" {
  interface FastifyInstance {
    keys: KeysService;
  }
}

export const keysPlugin = fp(async (app) => {
  const keys = new KeysService(app.db);
  await keys.ensureActive();

  app.decorate("keys", keys);
}, { name: "keys-plugin", dependencies: ["db-plugin"] });
