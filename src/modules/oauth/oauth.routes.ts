import { FastifyPluginAsync } from "fastify";

import { discoveryRoutes } from "./discovery.routes.js";
import { keysRoutes } from "./keys.routes.js";

export const oauthRoutes: FastifyPluginAsync = async (server) => {
  server.register(discoveryRoutes);
  server.register(keysRoutes);
};
