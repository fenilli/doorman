import { Kysely, PostgresDialect } from "kysely";
import pg, { type PoolConfig } from "pg";

import { Database } from "./schema.js";

export function createDatabase(config: PoolConfig): Kysely<Database> {
  const pool = new pg.Pool(config);

  return new Kysely<Database>({
    dialect: new PostgresDialect({ pool })
  });
}
