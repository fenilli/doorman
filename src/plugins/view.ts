import fp from "fastify-plugin";
import view from "@fastify/view";
import { Edge } from "edge.js";

import { config } from "@/config/index.js";
import { SRC_URL } from "@/config/paths.js";

export const viewPlugin = fp(async (server) => {
  const edge = new Edge({ cache: config.app.env === "production" });
  edge.mount(new URL("views/", SRC_URL));

  server.register(view, { engine: { edge } });
}, { name: "view-plugin" });
