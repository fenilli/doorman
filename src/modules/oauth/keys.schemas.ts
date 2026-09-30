import { Type } from "typebox";

export const JwksResponse = {
  200: Type.Object({
    keys: Type.Array(Type.Record(Type.String(), Type.Unknown()))
  })
};
