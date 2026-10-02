import fp from "fastify-plugin";

import { KeysService } from "@/modules/oauth/keys.service.js";

declare module "fastify" {
  interface FastifyInstance {
    keys: KeysService;
  }
}

export const keysPlugin = fp(async (server) => {
  const keys = new KeysService(server.db);
  await keys.ensureActive();

  server.decorate("keys", keys);
}, { name: "keys-plugin", dependencies: ["db-plugin"] });
