import fp from "fastify-plugin";
import jwt from "@fastify/jwt";

declare module "fastify" {
  interface FastifyInstance {
    authenticate: (request: FastifyRequest, reply: FastifyReply) => Promise<void>;
  }
}

declare module "@fastify/jwt" {
  interface FastifyJWT {
    payload: { sub: string; };
    user: { sub: string; };
  }
}

export default fp(async (app) => {
  await app.register(jwt, {
    secret: app.config.JWT_SECRET,
    sign: {
      expiresIn: "15m",
    }
  });

  app.decorate("authenticate", async (request, _) => {
    try {
      await request.jwtVerify();
    } catch (err) {
      throw app.httpErrors.unauthorized();
    }
  });
}, { name: "auth-plugin" });
