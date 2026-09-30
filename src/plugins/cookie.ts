import fp from "fastify-plugin";
import cookie from "@fastify/cookie";

export const cookiePlugin = fp((app) => {
  app.register(cookie, {
    secret: app.config.cookie.secret,
  });
}, { name: "cookie-plugin" });
