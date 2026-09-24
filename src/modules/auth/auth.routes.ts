import type { FastifyReply } from "fastify";
import type { FastifyPluginAsyncTypebox } from "@fastify/type-provider-typebox";

import { createUserService } from "@/modules/users/users.service.js";
import { createAuthService } from "./auth.service.js";
import { CredentialsSchema, TokenResponseSchema } from "./auth.schemas.js";

const REFRESH_COOKIE = "refresh_token";
const COOKIE_PATH = "/auth";

export default (async (app) => {
  const auth = createAuthService(app, createUserService(app));

  const setRefreshCookie = (reply: FastifyReply, token: string) =>
    reply.setCookie(REFRESH_COOKIE, token, {
      httpOnly: true,
      secure: app.config.NODE_ENV === "production",
      sameSite: "strict",
      path: COOKIE_PATH,
      maxAge: auth.refreshTtlSeconds,
    });

  const strictLimit = { rateLimit: { max: 5, timeWindow: "1 minute" } };

  app.post("/register", {
    schema: {
      body: CredentialsSchema,
      response: { 201: TokenResponseSchema }
    },
    config: strictLimit,
  }, async (request, reply) => {
    const { email, password } = request.body;
    const { accessToken, refreshToken } = await auth.register(email, password);

    setRefreshCookie(reply, refreshToken);
    return reply.status(201).send({ accessToken });
  });

  app.post("/login", {
    schema: {
      body: CredentialsSchema,
      response: { 200: TokenResponseSchema }
    },
    config: strictLimit
  }, async (request, reply) => {
    const { email, password } = request.body;
    const { accessToken, refreshToken } = await auth.login(email, password);

    setRefreshCookie(reply, refreshToken);
    return { accessToken };
  });

  app.post("/refresh", {
    schema: { response: { 200: TokenResponseSchema } },
    config: strictLimit,
  }, async (request, reply) => {
    const token = request.cookies[REFRESH_COOKIE];
    if (!token) throw app.httpErrors.unauthorized();

    const { accessToken, refreshToken } = await auth.refresh(token);

    setRefreshCookie(reply, refreshToken);
    return { accessToken };
  });

  app.post("/logout", async (request, reply) => {
    const token = request.cookies[REFRESH_COOKIE];
    if (token) await auth.logout(token);

    reply.clearCookie(REFRESH_COOKIE, { path: COOKIE_PATH });
    return reply.status(204).send();
  })
}) satisfies FastifyPluginAsyncTypebox;
