import type { KyselyDatabase } from "@/database/schema.js";
import type { GeneratedSigningKey } from "@/security/keys.js";

export const createKeysRepository = (db: KyselyDatabase) => ({
  findActive: () =>
    db.selectFrom("signing_keys").selectAll().where("status", "=", "active").executeTakeFirst(),

  listPublicJwks: () =>
    db.selectFrom("signing_keys").select("public_jwk").orderBy("created_at", "desc").execute(),

  insertActive: (key: GeneratedSigningKey) =>
    db.insertInto("signing_keys")
      .values({
        kid: key.kid,
        alg: key.alg,
        public_jwk: key.publicJwk,
        private_jwk: key.privateJwk
      })
      .onConflict(oc => oc.doNothing())
      .execute(),

  retireActive: () =>
    db.updateTable("signing_keys")
      .set({ status: "retired", retired_at: new Date() })
      .where("status", "=", "active")
      .execute()
});
