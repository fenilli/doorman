import { Type, type Static } from "typebox";
import { Value } from "typebox/value";

const EnvSchema = Type.Object({
  NODE_ENV: Type.Enum(["development", "production", "test"], { default: "development" }),

  HOST: Type.String({ default: "0.0.0.0" }),
  PORT: Type.Number({ default: 3000, minimum: 1, maximum: 65535 }),

  DB_HOST: Type.String({ default: "localhost" }),
  DB_PORT: Type.Number({ default: 5432 }),
  DB_NAME: Type.String({ default: "doorman_db" }),
  DB_USER: Type.String({ default: "doorman_user" }),
  DB_PASSWORD: Type.String(),

  OIDC_ISSUER: Type.String({ format: "uri" }),

  COOKIE_SECRET: Type.String({ minLength: 32 }),
});

export type Env = Static<typeof EnvSchema>;

export const parseEnv = (env: NodeJS.ProcessEnv = process.env): Env => {
  const defaulted = Value.Default(EnvSchema, { ...env });
  const converted = Value.Convert(EnvSchema, defaulted);
  const cleaned = Value.Clean(EnvSchema, converted);

  if (!Value.Check(EnvSchema, cleaned)) {
    const details = [...Value.Errors(EnvSchema, cleaned)]
      .map(issue => `   ${issue.instancePath.replace(/^\//, "") || "(root)"}: ${issue.message}`)
      .join("\n");

    throw new Error(`Invalid environment configuration:\n${details}`);
  }

  return cleaned;
};
