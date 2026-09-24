import type { FastifyInstance } from "fastify";

export function createUserService(app: FastifyInstance) {
  const { db } = app;

  return {
    findById: (id: string) =>
      db.selectFrom("users").select(["id", "email", "created_at"])
        .where("id", "=", id).executeTakeFirst(),

    findCredentialsByEmail: (email: string) =>
      db.selectFrom("users").select(["id", "email", "password_hash"])
        .where("email", "=", email.toLowerCase()).executeTakeFirst(),

    create: (data: { email: string, passwordHash: string }) =>
      db.insertInto("users")
        .values({ email: data.email.toLowerCase(), password_hash: data.passwordHash })
        .returning(["id", "email", "created_at"])
        .executeTakeFirstOrThrow(),

    updatePasswordHash: (id: string, passwordHash: string) =>
      db.updateTable("users").set({ password_hash: passwordHash })
        .where("id", "=", id)
        .execute(),

    delete: (id: string) =>
      db.deleteFrom("users").where("id", "=", id).execute()
  };
}

export type UserService = ReturnType<typeof createUserService>;
