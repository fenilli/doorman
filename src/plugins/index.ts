import fp from "fastify-plugin";

import { sensiblePlugin } from "./sensible.js";
import { errorHandlersPlugin } from "./error-handlers.js";
import { formbodyPlugin } from "./formbody.js";
import { cookiePlugin } from "./cookie.js";
import { dbPlugin } from "./db.js";
import { keysPlugin } from "./keys.js";

export const plugins = fp(async (app) => {
  await app.register(sensiblePlugin);
  await app.register(errorHandlersPlugin);
  await app.register(formbodyPlugin);
  await app.register(cookiePlugin);
  await app.register(dbPlugin);
  await app.register(keysPlugin);
});
