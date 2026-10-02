import fp from "fastify-plugin";
import fastifyStatic from "@fastify/static";

import { PUBLIC_PATH } from "@/config/paths.js";

export const staticPlugin = fp(async (server) => {
  server.register(fastifyStatic, {
    root: PUBLIC_PATH,
    prefix: "/public/"
  });
}, { name: "static-plugin" });
