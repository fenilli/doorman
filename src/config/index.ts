import { env } from "./env.js";

export const config = {
  app: {
    name: env.APP_NAME,
    env: env.APP_ENV,
    url: env.APP_URL,
    secret: env.APP_SECRET,
  },

  log: env.LOG_LEVEL === "silent"
    ? false
    : {
      level: env.LOG_LEVEL,
      transport: {
        target: "pino-pretty",
        options: {
          translateTime: "HH:MM:ss Z",
          ignore: "pid,hostname",
        }
      },
      redact: {
        paths: [
          "req.headers.authorization",
          "req.headers.cookie",
          "res.headers['set-cookie']",
          "*.password",
          "*.newPassword",
          "*.token",
          "*.accessToken",
          "*.refreshToken",
          "*.secret",
          "*.secretKey",
          "*.apiKey"
        ],
        censor: "[redacted]",
      }
    },

  server: {
    host: env.SERVER_HOST,
    port: env.SERVER_PORT,
  },

  database: {
    url: env.DB_URL,
  },

  rateLimit: {
    max: env.RATE_LIMIT_MAX,
    timeWindow: env.RATE_LIMIT_TIME_WINDOW
  },

  cookie: {
    secret: env.COOKIE_SECRET,
    key: env.COOKIE_KEY,
    secure: env.COOKIE_SECURE,
  },

  csrf: {
    key: env.CSRF_KEY,
  },

  oidc: {
    issuer: env.OIDC_ISSUER,
  }
} as const;

export type Config = typeof config;
