import fp from "fastify-plugin";
import env from "@fastify/env";
import { Type, Static } from "typebox";

declare module "fastify" {
  interface FastifyInstance {
    config: Static<typeof schema>;
  }
}

const schema = Type.Object({
  NODE_ENV: Type.String({ default: "development" }),

  APP_PORT: Type.Number({ default: 3000 }),
  APP_HOST: Type.String({ default: "localhost" }),

  LOG_LEVEL: Type.String({ default: "debug" }),
  RATE_LIMIT_MAX: Type.Number({ default: 100 }),

  DB_HOST: Type.String({ default: "localhost" }),
  DB_PORT: Type.Number({ default: 5432 }),
  DB_DATABASE: Type.String(),
  DB_USER: Type.String(),
  DB_PASSWORD: Type.String(),

  JWT_SECRET: Type.String(),
  COOKIE_SECRET: Type.String(),
});

export default fp(async (app) => {
  app.register(env, { schema });
}, { name: "env-plugin" });
