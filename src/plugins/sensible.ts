import fp from "fastify-plugin";
import sensible from "@fastify/sensible";

export const sensiblePlugin = fp(async (server) => {
  server.register(sensible);
}, { name: "sensible-plugin" });
