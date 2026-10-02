import fp from "fastify-plugin";
import view from "@fastify/view";
import { Edge } from "edge.js";

import { SRC_URL } from "@/config/paths.js";

export const viewPlugin = fp(async (app) => {
  const edge = new Edge({ cache: app.config.env === "production" });
  edge.mount(new URL("views/", SRC_URL));

  app.register(view, { engine: { edge } });
}, { name: "view-plugin" });
