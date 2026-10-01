import { sql, type Kysely } from "kysely"

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createTable("sessions")
    .addColumn("token_hash", "text", col => col.primaryKey())
    .addColumn("user_id", "uuid", col => col.notNull().references("users.id").onDelete("cascade"))
    .addColumn("auth_time", "timestamptz", col => col.notNull().defaultTo(sql`now()`))
    .addColumn("expires_at", "timestamptz")
    .addColumn("created_at", "timestamptz", col => col.notNull().defaultTo(sql`now()`))
    .execute();

  await db.schema.createIndex("sessions_user_id_idx").on("sessions").column("user_id").execute();
  await db.schema.createIndex("sessions_expires_at_idx").on("sessions").column("expires_at").execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable("sessions").execute();
}
