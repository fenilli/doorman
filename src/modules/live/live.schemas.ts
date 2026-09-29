import { Type } from "typebox";

export const LiveResponse = {
  200: Type.Object({
    status: Type.Literal("ok")
  })
};
