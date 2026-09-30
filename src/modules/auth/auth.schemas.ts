import { Type } from "typebox";

const ReturnTo = Type.Optional(Type.String({ maxLength: 2048 }));

export const ReturnToQuery = Type.Object({ return_to: ReturnTo });

export const LoginBody = Type.Object({
  email: Type.String({ format: "email", minLength: 1, maxLength: 254 }),
  password: Type.String({ minLength: 1, maxLength: 1024 }),
  return_to: ReturnTo,
});

export const RegisterBody = Type.Object({
  email: Type.String({ format: "email", minLength: 1, maxLength: 254 }),
  password: Type.String({ minLength: 8, maxLength: 64 }),
  name: Type.Optional(Type.String({ maxLength: 100 })),
  return_to: ReturnTo,
});
