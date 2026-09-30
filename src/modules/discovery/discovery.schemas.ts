import { Type } from "typebox";

const StringArray = Type.Array(Type.String());

export const DiscoveryResponse = {
  200: Type.Object({
    issuer: Type.String({ format: "url" }),
    jwks_uri: Type.String({ format: "url" }),
    id_token_signing_alg_values_supported: StringArray,
    subject_types_supported: StringArray,
    code_challenge_methods_supported: StringArray,
  })
};

export const JwksResponse = {
  200: Type.Object({
    keys: Type.Array(Type.Object({}, { additionalProperties: true }))
  })
};
