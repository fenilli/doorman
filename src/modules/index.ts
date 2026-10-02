import type { FastifyPluginAsync } from "fastify";

import { liveRoutes } from "./live/live.routes.js";
import { oauthRoutes } from "./oauth/oauth.routes.js";
import { usersRoutes } from "./users/users.routes.js";
import { authRoutes } from "./auth/auth.routes.js";

export const modules: FastifyPluginAsync = async (server) => {
  server.register(oauthRoutes, { prefix: "/.well-known" });
  server.register(liveRoutes, { prefix: "/live" });
  server.register(usersRoutes, { prefix: "/users" });
  server.register(authRoutes);
};
