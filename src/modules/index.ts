import type { FastifyPluginAsync } from "fastify";

import { liveRoutes } from "./live/live.routes.js";
import { oauthRoutes } from "./oauth/oauth.routes.js";
import { usersRoutes } from "./users/users.routes.js";

export const modules: FastifyPluginAsync = async (app) => {
  app.register(oauthRoutes, { prefix: "/.well-known" });
  app.register(liveRoutes, { prefix: "/live" });
  app.register(usersRoutes, { prefix: "/users" });
};
