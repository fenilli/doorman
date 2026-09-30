import { Generated, Insertable, Selectable, Updateable } from "kysely";

export interface SessionsTable {
  token_hash: string;
  user_id: string;
  auth_time: Generated<Date>;
  expires_at: Date;
  created_at: Generated<Date>;
}

export type SessionsRow = Selectable<SessionsTable>;
export type NewSessionsRow = Insertable<SessionsTable>;
export type SessionsRowUpdate = Updateable<SessionsTable>;
