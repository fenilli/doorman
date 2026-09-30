import fp from "fastify-plugin";

import { KeysService } from "@/modules/oauth/keys.service.js";

export const keysPlugin = fp(async (app) => {
  const keys = new KeysService(app.db);
  await keys.ensureActive();
}, { name: "keys-plugin", dependencies: ["db-plugin"] });
