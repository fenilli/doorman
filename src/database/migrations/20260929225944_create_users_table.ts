import { sql, type Kysely } from "kysely"

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createTable("users")
    .addColumn("id", "uuid", col => col.primaryKey().defaultTo(sql`uuidv7()`))
    .addColumn("email", "text", col => col.notNull().unique())
    .addColumn("email_verified", "boolean", col => col.notNull().defaultTo(false))
    .addColumn("password_hash", "text", col => col.notNull())
    .addColumn("name", "text")
    .addColumn("created_at", "timestamptz", col => col.notNull().defaultTo(sql`now()`))
    .addColumn("updated_at", "timestamptz", col => col.notNull().defaultTo(sql`now()`))
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable("users").execute();
}
