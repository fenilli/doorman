import type { FastifyReply, FastifyRequest } from "fastify";

const COOKIE_NAME = "doorman_session";

export const setSessionCookie = (reply: FastifyReply, token: string, expiresAt: Date, secure: boolean) =>
  reply.setCookie(COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    secure,
    path: "/",
    expires: expiresAt,
    signed: true,
  });

export const clearSessionCookie = (reply: FastifyReply, secure: boolean) =>
  reply.clearCookie(COOKIE_NAME, { path: "/", httpOnly: true, sameSite: "lax", secure });

export const readSessionToken = (request: FastifyRequest): string | undefined => {
  const raw = request.cookies[COOKIE_NAME];
  if (!raw) return undefined;

  const result = request.unsignCookie(raw);
  return result.valid && result.value ? result.value : undefined;
};
