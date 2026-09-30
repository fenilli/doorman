import fp from "fastify-plugin";
import formbody from "@fastify/formbody";

export const formbodyPlugin = fp((app) => {
  app.register(formbody);
}, { name: "formbody-plugin" });
