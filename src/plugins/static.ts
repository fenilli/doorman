import fp from "fastify-plugin";
import fastifyStatic from "@fastify/static";
import { fileURLToPath } from "node:url";

import { SRC_URL } from "@/config/paths.js";

const PUBLIC_PATH = fileURLToPath(new URL("public/", SRC_URL));

export const staticPlugin = fp(async (app) => {
  app.register(fastifyStatic, {
    root: PUBLIC_PATH,
    prefix: "/public/"
  });
}, { name: "static-plugin" });
