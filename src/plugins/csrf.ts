import fp from "fastify-plugin";
import csrf from "@fastify/csrf-protection";

import { config } from "@/config/index.js";

export const csrfPlugin = fp((server) => {
  server.register(csrf, {
    cookieKey: config.csrf.key,
    cookieOpts: {
      signed: true,
      httpOnly: true,
      sameSite: "strict",
      secure: config.cookie.secure,
      path: "/"
    }
  });
}, { name: "csrf-plugin", dependencies: ["cookie-plugin"] });
