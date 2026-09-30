import fp from "fastify-plugin";
import rateLimit from "@fastify/rate-limit";

export const rateLimitPlugin = fp(async (app) => {
  app.register(rateLimit, {
    max: app.config.rateLimit.max,
    timeWindow: app.config.rateLimit.timeWindow
  });
}, { name: "rate-limit-plugin" });
