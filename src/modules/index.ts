import { FastifyPluginAsync } from "fastify";

import authRoutes from "./auth/auth.routes.js";
import userRoutes from "./users/users.routes.js";

export default (async (app) => {
  app.register(authRoutes, { prefix: "/auth" });
  app.register(userRoutes, { prefix: "/users" });
}) satisfies FastifyPluginAsync;
