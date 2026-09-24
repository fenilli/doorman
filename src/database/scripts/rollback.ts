import { NO_MIGRATIONS } from "kysely/migration";

import { createMigrator } from "./migrator.js";

const { migrator, destroy } = createMigrator();

const all = process.argv.includes("--all");

console.log(`Starting rollback to ${all ? "nothing" : "latest batch"}...`);
const { error, results } = all ? await migrator.migrateTo(NO_MIGRATIONS) : await migrator.migrateDown();

if (!results?.length && !error) console.log("Nothing to do.");

for (const r of results ?? []) {
  console.log(`[${r.status}] ${r.migrationName}`);
}

if (error) console.error("Migrations failed:", error);

await destroy();
process.exit(error ? 1 : 0);
