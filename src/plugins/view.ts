import path from "node:path"
import fp from "fastify-plugin";
import view from "@fastify/view";
import { Eta } from "eta";

export const viewPlugin = fp(async (app) => {
  app.register(view, {
    engine: { eta: new Eta() },
    root: path.join(import.meta.dirname, "../views"),
    layout: "layout.eta",
    includeViewExtension: true,
  });
}, { name: "view-plugin" });
