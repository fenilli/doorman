import fp from "fastify-plugin";
import rateLimit from "@fastify/rate-limit";

export default fp(async (app) => {
  app.register(rateLimit, {
    max: app.config.RATE_LIMIT_MAX,
    timeWindow: "1 minute"
  });
}, { name: "rate-limit-plugin" });
