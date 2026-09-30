import type { FastifyPluginAsync } from "fastify";

import { liveRoutes } from "./live/live.routes.js";
import { discoveryRoutes } from "./discovery/discovery.routes.js";

export const modules: FastifyPluginAsync = async (app) => {
  app.register(discoveryRoutes);
  app.register(liveRoutes, { prefix: "/live" });
};
