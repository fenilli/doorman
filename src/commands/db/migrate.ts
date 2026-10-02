import { type MigrationResultSet, Migrator, NO_MIGRATIONS } from "kysely/migration";

import { createConfig } from "@/config/index.js";
import { MIGRATIONS_PATH } from "@/config/paths.js";
import { createDatabase } from "@/database/index.js";
import { FileMigrationProvider } from "./file-migration-provider.js";

type Command =
  | "up"
  | "down"
  | "latest"
  | "reset"
  | "fresh"
  | "status";

type CommandHandler = (migrator: Migrator) => Promise<void>;

const printResults = ({ error, results }: MigrationResultSet) => {
  for (const result of results ?? []) {
    console.log(`${result.status}: ${result.migrationName}`);
  }

  if (error) throw error;
}

const commands: Record<Command, CommandHandler> = {
  up: async (migrator) => printResults(await migrator.migrateUp()),
  down: async (migrator) => printResults(await migrator.migrateDown()),
  latest: async (migrator) => printResults(await migrator.migrateToLatest()),
  reset: async (migrator) => printResults(await migrator.migrateTo(NO_MIGRATIONS)),
  fresh: async (migrator) => {
    await commands.reset(migrator);
    await commands.latest(migrator);
  },
  status: async (migrator) => {
    const migrations = await migrator.getMigrations();

    for (const migration of migrations) {
      console.log(
        `${migration.executedAt ? "executed" : "pending"}: ${migration.name}`
      );
    }
  },
};

const isCommand = (command: string | undefined): command is Command => command !== undefined && command in commands;

const run = async (command: string | undefined) => {
  if (!isCommand(command)) {
    console.error(
      "Usage: npm run db:migrate <up|down|latest|reset|fresh|status>",
    );
    process.exitCode = 1;
    return;
  }

  const config = createConfig();
  const db = createDatabase({
    connectionString: config.database.url
  });

  try {
    const migrator = new Migrator({
      db,
      provider: new FileMigrationProvider(MIGRATIONS_PATH)
    });

    await commands[command](migrator);
  } finally {
    await db.destroy();
  }
}

await run(process.argv[2]).catch(err => {
  console.error(err);
  process.exitCode = 1;
});
