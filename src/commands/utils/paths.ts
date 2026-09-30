import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const sourceRoot = path.resolve(__dirname, "../..");

export const migrationsFolder = path.join(
  sourceRoot,
  "database/migrations"
);
