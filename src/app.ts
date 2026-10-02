import type { FastifyPluginAsync } from "fastify";

import { plugins } from "./plugins/index.js";
import { modules } from "./modules/index.js";

export const app: FastifyPluginAsync = async (server) => {
  await server.register(plugins);
  server.register(modules);
};
