import { Kysely, sql } from "kysely";

export async function up(db: Kysely<any>) {
  await db.schema
    .createTable("users")
    .addColumn("id", "uuid", c => c.primaryKey().defaultTo(sql`uuidv7()`))
    .addColumn("email", "varchar(255)", c => c.notNull().unique())
    .addColumn("password_hash", "text", c => c.notNull())
    .addColumn("created_at", "timestamptz", c => c.notNull().defaultTo(sql`now()`))
    .execute()
}

export async function down(db: Kysely<any>) {
  await db.schema.dropTable("users").execute();
}
