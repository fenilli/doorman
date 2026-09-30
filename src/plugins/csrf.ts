import fp from "fastify-plugin";
import csrf from "@fastify/csrf-protection";

export const csrfPlugin = fp((app) => {
  app.register(csrf, {
    cookieKey: "doorman_csrf",
    cookieOpts: {
      signed: true,
      httpOnly: true,
      sameSite: "strict",
      secure: app.config.cookie.secure,
      path: "/"
    }
  });
}, { name: "csrf-plugin", dependencies: ["cookie-plugin"] });
