import { Type } from "typebox";

export const CredentialsSchema = Type.Object({
  email: Type.String({ format: "email", maxLength: 254 }),
  password: Type.String({ minLength: 8, maxLength: 128 }),
});

export const TokenResponseSchema = Type.Object({
  accessToken: Type.String(),
});
