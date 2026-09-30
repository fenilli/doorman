import { Insertable, Selectable, Updateable } from "kysely";

import type { UsersTable } from "@/database/tables/users.table.js";
import type { KyselyDatabase } from "@/database/schema.js";

export type NewUser = Insertable<UsersTable>;
export type User = Selectable<UsersTable>;
export type UserUpdate = Updateable<UsersTable>;

export const createUsersRepository = (db: KyselyDatabase) => ({
  insert: (user: NewUser) =>
    db.insertInto("users")
      .values({ email: user.email, password_hash: user.password_hash, name: user.name })
      .returning(["id", "email", "name"])
      .executeTakeFirstOrThrow(),

  findByEmail: (email: string) =>
    db.selectFrom("users").selectAll().where("email", "=", email).executeTakeFirst(),

  findById: (id: string) =>
    db.selectFrom("users").selectAll().where("id", "=", id).executeTakeFirst(),
});
