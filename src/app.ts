import type { FastifyPluginAsync } from "fastify";

import type { Config } from "./config/index.js";

import { plugins } from "./plugins/index.js";
import { modules } from "./modules/index.js";

declare module "fastify" {
  interface FastifyInstance {
    config: Config;
  }
}

interface AppOptions {
  config: Config;
}

export const app: FastifyPluginAsync<AppOptions> = async (instance, { config }) => {
  instance.decorate("config", config);

  await instance.register(plugins);
  instance.register(modules);
};
