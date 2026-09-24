import fp from "fastify-plugin";

import env from "./env.js";
import db from "./db.js";
import sensible from "./sensible.js";
import rateLimit from "./rate-limit.js";
import cookie from "./cookie.js";
import auth from "./auth.js";

export default fp(async (app) => {
  await app.register(env);
  await app.register(db);

  app.register(sensible);
  app.register(rateLimit);
  app.register(cookie);
  app.register(auth);
});
