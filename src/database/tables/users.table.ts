import type { Generated, Insertable, Selectable, Updateable } from "kysely";

export interface UsersTable {
  id: Generated<string>;
  email: string;
  email_verified: Generated<boolean>;
  password_hash: string;
  name: string | null;
  created_at: Generated<Date>;
  updated_at: Generated<Date>;
}

export type UserRow = Selectable<UsersTable>;
export type NewUserRow = Insertable<UsersTable>;
export type UserRowUpdate = Updateable<UsersTable>;
