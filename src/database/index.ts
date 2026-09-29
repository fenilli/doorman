import { Kysely, PostgresDialect } from "kysely";
import { Pool, type PoolConfig } from "pg";

import { Database } from "./schema.js";

export const createDatabase = (config: PoolConfig): Kysely<Database> => new Kysely<Database>({
  dialect: new PostgresDialect({
    pool: new Pool(config),
  })
});
