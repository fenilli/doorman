import type { Kysely } from "kysely";

import type { Database } from "@/database/schema.js";
import type { NewUserRow, UserRow } from "@/database/tables/users.table.js";

export class UserRepository {
  constructor(private readonly db: Kysely<Database>) { }

  async insert(user: NewUserRow): Promise<UserRow> {
    return this.db
      .insertInto("users")
      .values(user)
      .returningAll()
      .executeTakeFirstOrThrow();
  }

  async findByEmail(email: string): Promise<UserRow | undefined> {
    return this.db
      .selectFrom("users")
      .selectAll()
      .where("email", "=", email)
      .executeTakeFirst();
  }

  async findById(id: string): Promise<UserRow | undefined> {
    return this.db
      .selectFrom("users")
      .selectAll()
      .where("id", "=", id)
      .executeTakeFirst();
  }



  async updatePasswordHash(id: string, passwordHash: string): Promise<void> {
    await this.db
      .updateTable("users")
      .set({ password_hash: passwordHash, updated_at: new Date() })
      .where("id", "=", id)
      .execute();
  }
}
