import type { Kysely } from "kysely";

import type { Database } from "@/database/schema.js";
import type { NewSessionsRow, SessionsRow } from "@/database/tables/sessions.table.js";

export class SessionsRepository {
  constructor(private readonly db: Kysely<Database>) { }

  async insert(session: NewSessionsRow): Promise<void> {
    await this.db.insertInto("sessions").values(session).execute();
  }

  async findValid(tokenHash: string): Promise<SessionsRow | undefined> {
    return this.db
      .selectFrom("sessions")
      .selectAll()
      .where("token_hash", "=", tokenHash)
      .where("expires_at", ">", new Date())
      .executeTakeFirst();
  }

  async delete(tokenHash: string): Promise<void> {
    await this.db.deleteFrom("sessions").where("token_hash", "=", tokenHash).execute();
  }

  async deleteExpired(): Promise<void> {
    await this.db.deleteFrom("sessions").where("expires_at", "<=", new Date()).execute();
  }
}
