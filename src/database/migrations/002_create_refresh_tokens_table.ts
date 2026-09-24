import { Kysely, sql } from "kysely";

export async function up(db: Kysely<any>) {
  await db.schema
    .createTable("refresh_tokens")
    .addColumn("id", "uuid", c => c.primaryKey().defaultTo(sql`uuidv7()`))
    .addColumn("user_id", "uuid", c => c.notNull().references("users.id").onDelete("cascade"))
    .addColumn("token_hash", "text", c => c.notNull().unique())
    .addColumn("expires_at", "timestamptz", c => c.notNull())
    .addColumn("revoked_at", "timestamptz")
    .addColumn("created_at", "timestamptz", c => c.notNull().defaultTo(sql`now()`))
    .execute()
}

export async function down(db: Kysely<any>) {
  await db.schema.dropTable("refresh_tokens").execute();
}
