import type { Kysely } from "kysely";

import type { Database } from "@/database/schema.js";
import type { UserRow } from "@/database/tables/users.table.js";
import type { CreateUserInput } from "./users.schemas.js";
import { UserRepository } from "./users.repository.js";
import { EmailTakenError, InvalidCredentialsError } from "./users.errors.js";
import { hashPassword, needsRehash, verifyPassword } from "./users.password.js";

const normalizeEmail = (email: string) => email.trim().toLowerCase();

const isUniqueViolation = (err: unknown) =>
  typeof err === "object" && err !== null && "code" in err && err.code === "23505";

export class UsersService {
  private readonly repository: UserRepository;

  constructor(private readonly db: Kysely<Database>) {
    this.repository = new UserRepository(db);
  }

  async createUser(input: CreateUserInput) {
    const email = normalizeEmail(input.email);

    const existing = await this.repository.findByEmail(email);
    if (existing) throw new EmailTakenError();

    const password_hash = await hashPassword(input.password);

    try {
      return this.repository.insert({
        email,
        password_hash,
        name: input.name,
      });
    } catch (err) {
      if (isUniqueViolation(err)) throw new EmailTakenError();
      throw err;
    }
  }


  async findById(id: string) {
    return this.repository.findById(id);
  }

  async authenticate(email: string, password: string): Promise<UserRow> {
    const user = await this.repository.findByEmail(normalizeEmail(email));

    const valid = await verifyPassword(password, user?.password_hash ?? await hashPassword("doorman-timing-equalizer"));
    if (!user || !valid) throw new InvalidCredentialsError();

    if (needsRehash(user.password_hash)) {
      await this.repository.updatePasswordHash(user.id, await hashPassword(password));
    }

    return user;
  }
}
