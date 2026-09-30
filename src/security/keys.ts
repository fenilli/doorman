import {
  type JWK, type GenerateKeyPairAlgorithm,
  calculateJwkThumbprint, exportJWK, generateKeyPair
} from "jose";

export const SIGNING_ALG: GenerateKeyPairAlgorithm = "ES256";

export interface GeneratedSigningKey {
  kid: string;
  alg: string;
  publicJwk: JWK;
  privateJwk: JWK;
}

export const generateSigningKey = async (): Promise<GeneratedSigningKey> => {
  const { publicKey, privateKey } = await generateKeyPair(SIGNING_ALG, { extractable: true });

  const publicJwk = await exportJWK(publicKey);
  const privateJwk = await exportJWK(privateKey);

  const kid = await calculateJwkThumbprint(publicJwk);
  const meta = { kid, alg: SIGNING_ALG, use: "sig" };

  return {
    kid,
    alg: SIGNING_ALG,
    publicJwk: { ...publicJwk, ...meta },
    privateJwk: { ...privateJwk, ...meta },
  };
};
