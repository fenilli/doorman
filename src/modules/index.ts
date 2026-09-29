import type { FastifyPluginAsync } from "fastify";

import { liveRoutes } from "./live/live.routes.js";

export const modules = (async (app) => {
  app.register(liveRoutes, { prefix: "/live" });
}) satisfies FastifyPluginAsync;
