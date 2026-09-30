import type { Kysely } from "kysely";

import type { Database } from "@/database/schema.js";
import type { CreateUserInput } from "./users.schemas.js";
import { UserRepository } from "./users.repository.js";
import { EmailTakenError, InvalidCredentialsError } from "./users.errors.js";
import { hashPassword } from "./utils/password.js";

const normalizeEmail = (email: string) => email.trim().toLowerCase();

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

    return this.repository.insert({
      email,
      password_hash,
      name: input.name,
    });
  }
}
