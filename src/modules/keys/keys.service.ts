import { type JWK, importJWK } from "jose";

import { KyselyDatabase } from "@/database/schema.js";
import { generateSigningKey } from "@/security/keys.js";
import { createKeysRepository } from "./keys.repository.js";

type ImportedKey = Awaited<ReturnType<typeof importJWK>>;

interface SigningKey {
  kid: string;
  alg: string;
  key: ImportedKey;
}

export const createKeysService = (db: KyselyDatabase) => {
  const repository = createKeysRepository(db);

  let cached: SigningKey | undefined;

  const ensureActive = async () => {
    const existing = await repository.findActive();
    if (existing) return existing;

    await repository.insertActive(await generateSigningKey());
    return (await repository.findActive())!;
  };

  const getSigningKey = async (): Promise<SigningKey> => {
    const row = await ensureActive();

    if (cached?.kid !== row.kid) {
      cached = { kid: row.kid, alg: row.alg, key: await importJWK(row.private_jwk, row.alg) };
    }

    return cached;
  };

  const getPublicJwks = async (): Promise<{ keys: JWK[] }> => {
    const rows = await repository.listPublicJwks();
    return { keys: rows.map(row => row.public_jwk) };
  };

  const rotate = async () => {
    const generated = await generateSigningKey();

    await db.transaction().execute(async (trx) => {
      const repo = createKeysRepository(trx);
      await repo.retireActive();
      await repo.insertActive(generated);
    });

    cached = undefined;
    return generated.kid;
  };

  return { ensureActive, getSigningKey, getPublicJwks, rotate };
};

export type KeysService = ReturnType<typeof createKeysService>;
