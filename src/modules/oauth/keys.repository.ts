import {
  type GenerateKeyPairAlgorithm,
  calculateJwkThumbprint, exportJWK, generateKeyPair
} from "jose";
import type { Kysely, Transaction } from "kysely";

import type { Database } from "@/database/schema.js";
import type { NewSigningKeyRow, SigningKeyRow } from "@/database/tables/signing_keys.table.js";

const SIGNING_ALG: GenerateKeyPairAlgorithm = "ES256";

export class KeysRepository {
  constructor(private readonly db: Kysely<Database> | Transaction<Database>) { }

  async generateKeyPair(): Promise<NewSigningKeyRow> {
    const { publicKey, privateKey } = await generateKeyPair(SIGNING_ALG, { extractable: true });

    const publicJwk = await exportJWK(publicKey);
    const privateJwk = await exportJWK(privateKey);

    const kid = await calculateJwkThumbprint(publicJwk);
    const meta = { kid, alg: SIGNING_ALG, use: "sig" };

    return {
      kid,
      alg: SIGNING_ALG,
      public_jwk: { ...publicJwk, ...meta },
      private_jwk: { ...privateJwk, ...meta }
    }
  }

  async findActive(): Promise<SigningKeyRow | undefined> {
    return this.db
      .selectFrom("signing_keys")
      .selectAll()
      .where("status", "=", "active")
      .executeTakeFirst();
  }

  async listPublicJwks(): Promise<{ public_jwk: SigningKeyRow["public_jwk"] }[]> {
    return this.db
      .selectFrom("signing_keys")
      .select("public_jwk")
      .orderBy("created_at", "desc")
      .execute();
  }

  async insertActive(key: NewSigningKeyRow): Promise<void> {
    await this.db.insertInto("signing_keys")
      .values(key)
      .onConflict(oc => oc.doNothing())
      .execute();
  }

  async retireActive(): Promise<void> {
    await this.db
      .updateTable("signing_keys")
      .set({ status: "retired", retired_at: new Date() })
      .where("status", "=", "active")
      .execute();
  }
}
