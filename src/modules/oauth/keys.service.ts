import { type JWK, importJWK } from "jose";
import type { Kysely, Transaction } from "kysely";

import { Database } from "@/database/schema.js";
import { KeysRepository } from "./keys.repository.js";

type ImportedKey = Awaited<ReturnType<typeof importJWK>>;

export interface ActiveSigningKey {
  readonly kid: string;
  readonly alg: string;
  readonly key: ImportedKey;
}

export class KeysService {
  private readonly repository: KeysRepository;
  private cached: ActiveSigningKey | undefined;

  constructor(private readonly db: Kysely<Database> | Transaction<Database>) {
    this.repository = new KeysRepository(db);
  }

  async ensureActive() {
    const existing = await this.repository.findActive();
    if (existing) return existing;

    const generated = await this.repository.generateKeyPair();
    await this.repository.insertActive(generated);

    return (await this.repository.findActive())!;
  }

  async getSigningKey(): Promise<ActiveSigningKey> {
    const row = await this.ensureActive();

    if (this.cached?.kid !== row.kid) {
      this.cached = {
        kid: row.kid,
        alg: row.alg,
        key: await importJWK(row.private_jwk, row.alg)
      };
    }

    return this.cached;
  }

  async getPublicJwks(): Promise<{ keys: JWK[] }> {
    const rows = await this.repository.listPublicJwks();
    return { keys: rows.map(row => row.public_jwk) };
  }

  async rotate(): Promise<string> {
    await this.db.transaction().execute(async (trx) => {
      const repo = new KeysRepository(trx);
      const generated = await repo.generateKeyPair();

      await repo.retireActive();
      await repo.insertActive(generated);
    });

    this.cached = undefined;
    const active = await this.ensureActive();
    return active.kid;
  }
}
