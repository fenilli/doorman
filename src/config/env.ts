import { z } from "zod";

const environment = z.enum(["development", "test", "production"]).default("production");

const duration = z.union([
  z.coerce.number().int().positive(),
  z.string().regex(/^\d+\s*(ms|milliseconds?|s|seconds?|m|minutes?|h|hours?|d|days?)$/i)
]);

const booleanEnv = z.preprocess((val) => {
  if (typeof val === "string") {
    if (val.toLowerCase() === "true" || val === "1") return true;
    if (val.toLowerCase() === "false" || val === "0") return false;
  }
  return val;
}, z.boolean());

const EnvSchema = z.object({
  NODE_ENV: z.optional(environment),

  APP_NAME: z.string().min(1),
  APP_ENV: environment,
  APP_URL: z.url(),
  APP_SECRET: z.string().min(32),

  LOG_LEVEL: z.enum(["trace", "debug", "info", "warn", "error", "critical", "silent"]).default("silent"),

  SERVER_HOST: z.optional(z.string().min(1)),
  SERVER_PORT: z.optional(z.coerce.number().int().min(1).max(65535)),

  DB_HOST: z.string().min(1),
  DB_PORT: z.coerce.number().int().min(1).max(65535),
  DB_DATABASE: z.string().min(1),
  DB_USERNAME: z.string().min(1),
  DB_PASSWORD: z.string(),
  DB_URL: z.optional(z.url()),

  RATE_LIMIT_MAX: z.coerce.number().int().positive(),
  RATE_LIMIT_TIME_WINDOW: duration,

  COOKIE_SECRET: z.string().min(32),
  COOKIE_SECURE: z.optional(booleanEnv),
  COOKIE_KEY: z.string().min(1),

  CSRF_KEY: z.string().min(1),

  OIDC_ISSUER: z.optional(z.url()),
}).transform((data) => {
  const appUrl = new URL(data.APP_URL);
  const oidcUrl = data.OIDC_ISSUER ? new URL(data.OIDC_ISSUER) : appUrl;

  const defaultPort = appUrl.protocol === "https:" ? 443 : 80;
  const parsedPort = appUrl.port ? Number(appUrl.port) : defaultPort;

  const dbURL = data.DB_URL
    ? data.DB_URL
    : `postgres://${data.DB_USERNAME}:${encodeURIComponent(data.DB_PASSWORD)}@${data.DB_HOST}:${data.DB_PORT}/${data.DB_DATABASE}`;

  return {
    ...data,

    NODE_ENV: data.NODE_ENV ?? data.APP_ENV,

    SERVER_HOST: data.SERVER_HOST ?? appUrl.hostname,
    SERVER_PORT: data.SERVER_PORT ?? parsedPort,

    DB_URL: dbURL,

    COOKIE_SECURE: data.COOKIE_SECURE ?? (oidcUrl.origin === "https:"),

    OIDC_ISSUER: oidcUrl.href,
  };
});

export const env = z.compile(EnvSchema).parse(process.env);
process.env.NODE_ENV = env.NODE_ENV;
