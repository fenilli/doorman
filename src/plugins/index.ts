import fp from "fastify-plugin";

import { sensiblePlugin } from "./sensible.js";
import { errorHandlersPlugin } from "./error-handlers.js";
import { dbPlugin } from "./db.js";

export const plugins = fp(async (app) => {
  await app.register(sensiblePlugin);
  await app.register(errorHandlersPlugin);
  await app.register(dbPlugin);
});
