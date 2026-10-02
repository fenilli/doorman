import { pathToFileURL } from "node:url";

export const ROOT_URL = new URL("..", pathToFileURL(import.meta.dirname));
export const SRC_URL = new URL("src/", ROOT_URL);
