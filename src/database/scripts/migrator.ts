import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { FileMigrationProvider, Migrator } from "kysely/migration";

import { createDatabase } from "../index.js";

const migrationFolder = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "../migrations"
);

export function createMigrator(): { migrator: Migrator, destroy: () => Promise<void> } {
  const db = createDatabase({
    host: process.env.DB_HOST ?? "localhost",
    port: Number(process.env.DB_PORT ?? 5432),
    database: process.env.DB_DATABASE,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD ?? "",
  });

  const migrator = new Migrator({
    db,
    provider: new FileMigrationProvider({
      fs,
      path,
      migrationFolder
    })
  });

  return { migrator, destroy: async () => await db.destroy() };
}
