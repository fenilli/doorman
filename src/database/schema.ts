import { Kysely } from "kysely";

import { SigningKeysTable } from "./tables/signing_keys.table.js";

export interface Database {
  signing_keys: SigningKeysTable;
};

export type KyselyDatabase = Kysely<Database>;
