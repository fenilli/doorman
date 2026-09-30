import { sql, type Kysely } from "kysely"

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createTable("signing_keys")
    .addColumn("kid", "text", col => col.primaryKey())
    .addColumn("alg", "text", col => col.notNull())
    .addColumn("public_jwk", "jsonb", col => col.notNull())
    .addColumn("private_jwk", "jsonb", col => col.notNull())
    .addColumn("status", "text", col => col.notNull().defaultTo("active"))
    .addColumn("created_at", "timestamptz", col => col.notNull().defaultTo(sql`now()`))
    .addColumn("retired_at", "timestamptz")
    .addCheckConstraint("signing_keys_status_check", sql`status in ('active', 'retired')`)
    .execute();

  await db.schema
    .createIndex("signing_keys_one_active")
    .on("signing_keys")
    .column("status")
    .unique()
    .where(sql.ref("status"), "=", sql.lit("active"))
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropIndex("signing_keys_one_active").execute();
  await db.schema.dropTable("signing_keys").execute();
}
