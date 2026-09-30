import { FastifyPluginAsync } from "fastify";

import { discoveryRoutes } from "./discovery.routes.js";
import { keysRoutes } from "./keys.routes.js";

export const oauthRoutes: FastifyPluginAsync = async (app) => {
  app.register(discoveryRoutes);
  app.register(keysRoutes);
};
