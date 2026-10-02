import fp from "fastify-plugin";

import { sensiblePlugin } from "./sensible.js";
import { errorHandlersPlugin } from "./error-handlers.js";
import { formbodyPlugin } from "./formbody.js";
import { cookiePlugin } from "./cookie.js";
import { dbPlugin } from "./db.js";
import { keysPlugin } from "./keys.js";
import { rateLimitPlugin } from "./rate-limit.js";
import { viewPlugin } from "./view.js";
import { csrfPlugin } from "./csrf.js";
import { staticPlugin } from "./static.js";

export const plugins = fp(async (server) => {
  await server.register(rateLimitPlugin);
  await server.register(sensiblePlugin);
  await server.register(errorHandlersPlugin);
  await server.register(formbodyPlugin);
  await server.register(cookiePlugin);
  await server.register(csrfPlugin);
  await server.register(dbPlugin);
  await server.register(keysPlugin);
  await server.register(staticPlugin);
  await server.register(viewPlugin);
});
