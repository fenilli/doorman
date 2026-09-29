import fs from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { type Migration, type MigrationProvider } from "kysely/migration";

export class FileMigrationProvider implements MigrationProvider {
  constructor(private readonly folder: string) { }

  async getMigrations(): Promise<Record<string, Migration>> {
    const files = (await fs.readdir(this.folder))
      .filter(filename => !filename.endsWith(".d.ts"))
      .filter(filename => /\.(?:ts|js)$/.test(filename));

    const migrations = await Promise.all(
      files.map(async (filename) => {
        const name = path.basename(
          filename,
          path.extname(filename)
        );

        const url = pathToFileURL(
          path.join(this.folder, filename)
        );

        const migration = await import(url.href);

        return [name, migration] as const;
      })
    );

    return Object.fromEntries(migrations);
  }
}
