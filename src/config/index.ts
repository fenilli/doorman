import type { FastifyServerOptions } from "fastify";

import { parseEnv, type Env } from "./env.js";

interface ServerConfig {
  host: Env["HOST"];
  port: Env["PORT"];
  logger: FastifyServerOptions["logger"];
}

interface DatabaseConfig {
  url: `postgres://${Env["DB_USER"]}:${Env["DB_PASSWORD"]}@${Env["DB_HOST"]}:${Env["DB_PORT"]}/${Env["DB_NAME"]}`;
}

interface OIDCConfig {
  issuer: Env["OIDC_ISSUER"];
}

interface CookieConfig {
  secret: Env["COOKIE_SECRET"];
  secure: boolean;
}

export interface Config {
  env: Env["NODE_ENV"];
  server: ServerConfig;
  database: DatabaseConfig;
  oidc: OIDCConfig;
  cookie: CookieConfig;
};

const parseServerConfig = (env: Env): ServerConfig => {
  let logger: FastifyServerOptions["logger"] = false;
  if (env.NODE_ENV === "development") {
    logger = {
      level: "debug",
      transport: {
        target: "pino-pretty",
        options: {
          translateTime: "HH:MM:ss Z",
          ignore: "pid,hostname",
        },
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
    };
  }

  return {
    host: env.HOST,
    port: env.PORT,
    logger,
  };
};

const parseDatabaseConfig = (env: Env): DatabaseConfig => {
  const url = `postgres://${env.DB_USER}:${env.DB_PASSWORD}@${env.DB_HOST}:${env.DB_PORT}/${env.DB_NAME}` as const;

  return {
    url,
  };
};

const parseOIDCConfig = (env: Env): OIDCConfig => {
  const issuer = env.OIDC_ISSUER.replace(/\/+$/, "");

  return {
    issuer,
  }
};

const parseCookieConfig = (env: Env): CookieConfig => {
  return {
    secret: env.COOKIE_SECRET,
    secure: env.OIDC_ISSUER.startsWith("https://"),
  }
};

export const createConfig = (env: NodeJS.ProcessEnv = process.env): Config => {
  const parsed = parseEnv(env);

  return {
    env: parsed.NODE_ENV,
    server: parseServerConfig(parsed),
    database: parseDatabaseConfig(parsed),
    oidc: parseOIDCConfig(parsed),
    cookie: parseCookieConfig(parsed),
  };
}
