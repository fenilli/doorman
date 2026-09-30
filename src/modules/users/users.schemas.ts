import { Type, Static } from "typebox";

import { DomainErrorSchema } from "@/core/errors.js";

export const CreateUserBody = Type.Object({
  email: Type.String({ format: "email" }),
  password: Type.String({ minLength: 8, maxLength: 64 }),
  name: Type.Optional(Type.String()),
});

export type CreateUserInput = Static<typeof CreateUserBody>;

export const CreateUserResponse = {
  201: Type.Object({
    id: Type.String(),
    email: Type.String({ format: "email" }),
    name: Type.Union([Type.String(), Type.Null()])
  }),
  409: DomainErrorSchema,
};
