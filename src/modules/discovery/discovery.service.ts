export const createDiscoveryService = () => {
  const buildDiscoveryDocument = (issuer: string) => ({
    issuer,
    jwks_uri: `${issuer}/jwks.json`,
    id_token_signing_alg_values_supported: ["ES256"],
    subject_types_supported: ["public"],
    code_challenge_methods_supported: ["S256"],
  })

  return { buildDiscoveryDocument };
};

export type DiscoveryService = ReturnType<typeof createDiscoveryService>;
