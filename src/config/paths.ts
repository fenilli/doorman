import { fileURLToPath, pathToFileURL } from "node:url";

export const ROOT_URL = new URL("..", pathToFileURL(import.meta.dirname));
export const SRC_URL = new URL("src/", ROOT_URL);

const relativeFrom = (relative: string, from: URL) => fileURLToPath(new URL(relative, from));
const relativeFromRoot = (relative: string) => relativeFrom(relative, ROOT_URL);
const relativeFromSrc = (relative: string) => relativeFrom(relative, SRC_URL);

export const PUBLIC_PATH = relativeFromSrc("public/");
export const MIGRATIONS_PATH = relativeFromSrc("database/migrations/");
