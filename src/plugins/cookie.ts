import fp from "fastify-plugin";
import cookie from "@fastify/cookie";

import { config } from "@/config/index.js";

export const cookiePlugin = fp((server) => {
  server.register(cookie, {
    secret: config.cookie.secret,
  });
}, { name: "cookie-plugin" });
