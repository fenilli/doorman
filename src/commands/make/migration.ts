import fs from "node:fs/promises";
import path from "node:path";

import { MIGRATIONS_PATH } from "@/config/paths.js";
import { dedent } from "@/utils/dedent.js";

const template = dedent`
  import type { Kysely } from "kysely"

  export async function up(db: Kysely<any>): Promise<void> {

  }

  export async function down(db: Kysely<any>): Promise<void> {

  }
`;

const run = async (args: string[]) => {
  const name = args.join("_").toLowerCase();

  if (!/^[a-z0-9_]+$/.test(name)) {
    console.error(
      "Usage: npm run make:migration [name] (e.g. make:migration create_users)",
    );
    process.exitCode = 1;
    return;
  }

  const timestamp = new Date().toISOString().replace(/\D/g, "").slice(0, 14);
  const filename = `${timestamp}_${name}.ts`;

  await fs.mkdir(MIGRATIONS_PATH, { recursive: true });
  await fs.writeFile(path.join(MIGRATIONS_PATH, filename), `${template}\n`, { flag: "wx" });

  console.log(`created: database/migrations/${filename}`);
};

await run(process.argv.slice(2)).catch(err => {
  console.error(err);
  process.exitCode = 1
});
