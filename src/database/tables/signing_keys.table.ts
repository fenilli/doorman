import type { JWK } from "jose";
import type { Generated } from "kysely";

export interface SigningKeysTable {
  kid: string;
  alg: string;
  public_jwk: JWK;
  private_jwk: JWK;
  status: Generated<"active" | "retired">;
  created_at: Generated<Date>;
  retired_at: Date | null;
}
