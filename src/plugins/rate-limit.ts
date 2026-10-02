import fp from "fastify-plugin";
import rateLimit from "@fastify/rate-limit";

import { config } from "@/config/index.js";

export const rateLimitPlugin = fp(async (server) => {
  server.register(rateLimit, {
    max: config.rateLimit.max,
    timeWindow: config.rateLimit.timeWindow
  });
}, { name: "rate-limit-plugin" });
