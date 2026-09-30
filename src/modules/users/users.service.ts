import { KyselyDatabase } from "@/database/schema.js";
import { hashPassword } from "@/security/password.js";
import { createUsersRepository } from "./users.repository.js";

export interface CreateUserInput { email: string, password: string, name?: string };

export class EmailTakenError extends Error {
  constructor() {
    super("A user with this email already exists");
  }
}

const normalizeEmail = (email: string) => email.trim().toLowerCase();

export const createUsersService = (db: KyselyDatabase) => {
  const repository = createUsersRepository(db);

  const createUser = async (input: CreateUserInput) => {
    const email = normalizeEmail(input.email);

    if (await repository.findByEmail(email)) throw new EmailTakenError();

    return repository.insert({
      email,
      password_hash: await hashPassword(input.password),
      name: input.name,
    });
  };

  const findByEmail = async (email: string) => repository.findByEmail(normalizeEmail(email));

  return { createUser, findByEmail };
};

export type UsersService = ReturnType<typeof createUsersService>;
