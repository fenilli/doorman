import { RefreshTokensTable } from "./tables/refresh-tokens.table.js";
import { UsersTable } from "./tables/users.table.js";

export interface Database {
  users: UsersTable;
  refresh_tokens: RefreshTokensTable;
}
