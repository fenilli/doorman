import type { FastifyReply, FastifyRequest } from "fastify";
import type { FastifyPluginAsyncTypebox } from "@fastify/type-provider-typebox";

import { UsersService } from "@/modules/users/users.service.js";
import { EmailTakenError, InvalidCredentialsError } from "@/modules/users/users.errors.js";
import { SessionsService } from "./sessions.service.js";
import { LoginBody, RegisterBody, ReturnToQuery } from "./auth.schemas.js";
import { clearSessionCookie, readSessionToken, setSessionCookie } from "./auth.cookies.js";
import { safeReturnTo } from "./auth.redirects.js";

const formRateLimit = { rateLimit: { max: 10, timeWindow: "1 min" } };

export const authRoutes: FastifyPluginAsyncTypebox = async (app) => {
  const users = new UsersService(app.db);
  const sessions = new SessionsService(app.db);
  const secure = app.config.cookie.secure;

  const render = async (reply: FastifyReply, view: string, data: Record<string, unknown>, status = 200) => {
    const csrfToken = await reply.generateCsrf();
    return reply.code(status).viewAsync(view, { ...data, csrfToken });
  }

  app.addHook("onRequest", async (_, reply) => {
    reply
      .cacheControl("no-store")
      .header("content-security-policy", "default-src 'none'; style-src 'unsafe-inline'; frame-ancestors 'none'; base-uri 'none'");
  });

  const currentSession = async (request: FastifyRequest) => {
    const token = readSessionToken(request);
    return token ? sessions.resolve(token) : undefined;
  };

  const startSession = async (request: FastifyRequest, reply: FastifyReply, userId: string) => {
    const previous = readSessionToken(request);
    if (previous) await sessions.destroy(previous);

    const { token, expiresAt } = await sessions.create(userId);
    setSessionCookie(reply, token, expiresAt, secure);
  };

  app.get("/login", {
    schema: {
      querystring: ReturnToQuery
    }
  }, async (request, reply) => {
    const returnTo = safeReturnTo(request.query.return_to);

    if (await currentSession(request)) return reply.redirect(returnTo);

    return render(reply, "auth/login", { title: "Sign in", returnTo });
  });

  app.post("/login", {
    schema: {
      body: LoginBody
    },
    attachValidation: true,
    config: formRateLimit,
  }, async (request, reply) => {
    const returnTo = safeReturnTo(request.body.return_to);

    if (request.validationError) {
      return render(reply, "auth/login", {
        title: "Sign in",
        returnTo,
        error: "Enter your email and password"
      }, 400);
    }

    const { email, password } = request.body;

    try {
      const user = await users.authenticate(email, password);
      await startSession(request, reply, user.id);

      return reply.redirect(returnTo);
    } catch (err) {
      if (err instanceof InvalidCredentialsError) {
        return render(reply, "auth/login", {
          title: "Sign in",
          returnTo,
          error: err.message
        }, 401);
      }
      throw err;
    }
  });

  app.get("/register", {
    schema: {
      querystring: ReturnToQuery
    }
  }, async (request, reply) => {
    const returnTo = safeReturnTo(request.query.return_to);

    if (await currentSession(request)) return reply.redirect(returnTo);

    return render(reply, "auth/register", { title: "Create account", returnTo });
  });

  app.post("/register", {
    schema: {
      body: RegisterBody
    },
    attachValidation: true,
    config: formRateLimit,
  }, async (request, reply) => {
    const returnTo = safeReturnTo(request.body?.return_to);

    if (request.validationError) {
      return render(reply, "auth/register", {
        title: "Create account",
        returnTo,
        email: request.body?.email,
        name: request.body?.name,
        error: "Enter a valid email and a password of 8 to 64 characters.",
      }, 400);
    }

    const { email, password, name } = request.body;

    try {
      const user = await users.createUser({ email, password, name: name?.trim() || undefined });
      await startSession(request, reply, user.id);

      return reply.redirect(returnTo);
    } catch (err) {
      if (err instanceof EmailTakenError) {
        return render(reply, "auth/register", {
          title: "Create account",
          returnTo,
          email,
          name,
          error: err.message,
        }, 409);
      }
      throw err;
    }
  });

  app.post("/logout", async (request, reply) => {
    const token = readSessionToken(request);
    if (token) await sessions.destroy(token);

    clearSessionCookie(reply, secure);

    return reply.redirect("/login");
  });

  app.get("/account", async (request, reply) => {
    const session = await currentSession(request);
    if (!session) return reply.redirect("/login?return_to=/account");

    const user = await users.findById(session.user_id);
    if (!user) {
      clearSessionCookie(reply, secure);
      return reply.redirect("/login");
    }

    return reply.viewAsync("auth/account", {
      title: "Account",
      email: user.email,
      name: user.name
    });
  });
};
