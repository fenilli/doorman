import { Kysely } from "kysely";

import { SigningKeysTable } from "./tables/signing_keys.table.js";
import { UsersTable } from "./tables/users.table.js";

export interface Database {
  users: UsersTable;
  signing_keys: SigningKeysTable;
};

export type KyselyDatabase = Kysely<Database>;
