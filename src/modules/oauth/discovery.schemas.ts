import { Type } from "typebox";

const StringArray = Type.Array(Type.String());

export const DiscoveryResponse = {
  200: Type.Object({
    issuer: Type.String({ format: "uri" }),
    jwks_uri: Type.String({ format: "uri" }),
    id_token_signing_alg_values_supported: StringArray,
    subject_types_supported: StringArray,
    code_challenge_methods_supported: StringArray,
  })
};
