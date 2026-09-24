import { createMigrator } from "./migrator.js";

const { migrator, destroy } = createMigrator();

console.log("Starting migrations...");
const { error, results } = await migrator.migrateToLatest();

if (!results?.length && !error) console.log("Nothing to do.");

for (const r of results ?? []) {
  console.log(`[${r.status}] ${r.migrationName}`);
}

if (error) console.error("Migrations failed:", error);

await destroy();
process.exit(error ? 1 : 0);
