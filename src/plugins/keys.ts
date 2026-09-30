import fp from "fastify-plugin";

import { type KeysService, createKeysService } from "@/modules/keys/keys.service.js";

declare module "fastify" {
  interface FastifyInstance {
    keys: KeysService;
  }
}

export const keysPlugin = fp(async (app) => {
  const keys = createKeysService(app.db);
  await keys.ensureActive();

  app.decorate("keys", keys);
}, { name: "keys-plugin", dependencies: ["db-plugin"] });
