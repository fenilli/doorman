export class DiscoveryService {
  buildDiscoveryDocument(issuer: string) {
    return {
      issuer,
      jwks_uri: `${issuer}/.well-known/jwks.json`,
      id_token_signing_alg_values_supported: ["ES256"],
      subject_types_supported: ["public"],
      code_challenge_methods_supported: ["S256"],
    };
  }
}
