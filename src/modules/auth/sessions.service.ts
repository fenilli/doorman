import type { Kysely } from "kysely";

import type { Database } from "@/database/schema.js";
import type { SessionsRow } from "@/database/tables/sessions.table.js";
import { generateToken, hashToken } from "@/core/token.js";
import { SessionsRepository } from "./sessions.repository.js";

const SESSION_TTL_MS = 7 * 24 * 60 * 60 * 1000;

export class SessionsService {
  private readonly repository: SessionsRepository;

  constructor(db: Kysely<Database>) {
    this.repository = new SessionsRepository(db);
  }

  async create(userId: string): Promise<{ token: string, expiresAt: Date }> {
    const token = generateToken();
    const expiresAt = new Date(Date.now() + SESSION_TTL_MS);

    await this.repository.insert({
      token_hash: hashToken(token),
      user_id: userId,
      expires_at: expiresAt
    });

    return { token, expiresAt };
  }

  async resolve(token: string): Promise<SessionsRow | undefined> {
    return this.repository.findValid(hashToken(token));
  }

  async destroy(token: string): Promise<void> {
    return this.repository.delete(hashToken(token));
  }
}
