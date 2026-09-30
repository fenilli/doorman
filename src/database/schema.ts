import { SessionsTable } from "./tables/sessions.table.js";
import { SigningKeysTable } from "./tables/signing_keys.table.js";
import { UsersTable } from "./tables/users.table.js";

export interface Database {
  users: UsersTable;
  signing_keys: SigningKeysTable;
  sessions: SessionsTable;
};
