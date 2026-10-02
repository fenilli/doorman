import fp from "fastify-plugin";
import formbody from "@fastify/formbody";

export const formbodyPlugin = fp((server) => {
  server.register(formbody);
}, { name: "formbody-plugin" });
