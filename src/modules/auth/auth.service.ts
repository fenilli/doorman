import type { FastifyInstance } from "fastify";
import argon2 from "argon2";
import { createHash, randomBytes } from "node:crypto";

import type { UserService } from "@/modules/users/users.service.js";

const REFRESH_TTL_MS = 30 * 24 * 60 * 60 * 1000;
const sha256 = (v: string) => createHash("sha256").update(v).digest("hex");

export function createAuthService(app: FastifyInstance, users: UserService) {
  const { db, httpErrors } = app;

  async function issueToken(userId: string) {
    const refreshToken = randomBytes(32).toString("base64url");

    await db.insertInto("refresh_tokens").values({
      user_id: userId,
      token_hash: sha256(refreshToken),
      expires_at: new Date(Date.now() + REFRESH_TTL_MS),
    }).execute();

    return { accessToken: app.jwt.sign({ sub: userId }), refreshToken };
  }

  return {
    refreshTtlSeconds: REFRESH_TTL_MS / 1000,

    async register(email: string, password: string) {
      if (await users.findCredentialsByEmail(email)) throw httpErrors.conflict("Email already registered.");

      try {
        const user = await users.create({ email, passwordHash: await argon2.hash(password) });

        return issueToken(user.id);
      } catch (err) {
        if ((err as { code?: string }).code === "23505") throw httpErrors.conflict("Email already registered.");
        throw err;
      }
    },

    async login(email: string, password: string) {
      const user = await users.findCredentialsByEmail(email);

      const ok = user
        ? await argon2.verify(user.password_hash, password)
        : (await argon2.hash(password), false);

      if (!user || !ok) throw httpErrors.unauthorized("Invalid email or password.");

      return issueToken(user.id);
    },

    async refresh(refreshToken: string) {
      const row = await db.updateTable("refresh_tokens")
        .set({ revoked_at: new Date() })
        .where("token_hash", "=", sha256(refreshToken))
        .where("revoked_at", "is", null)
        .where("expires_at", ">", new Date())
        .returning("user_id")
        .executeTakeFirst();

      if (!row) throw httpErrors.unauthorized();

      return issueToken(row.user_id);
    },

    async logout(refreshToken: string) {
      await db.updateTable("refresh_tokens")
        .set({ revoked_at: new Date() })
        .where("token_hash", "=", sha256(refreshToken))
        .execute();
    }
  };
}
