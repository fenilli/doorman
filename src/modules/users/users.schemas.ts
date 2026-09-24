import { Type } from "typebox";

export const UserResponseSchema = Type.Object({
  id: Type.String({ format: "uuid" }),
  email: Type.String({ format: "email" }),
  created_at: Type.Unsafe<Date>({ type: "string", format: "date-time" })
});
