import { DomainError } from "@/core/errors.js";

export class EmailTakenError extends DomainError {
  override readonly statusCode: number = 409;
  override readonly code: string = "EMAIL_TAKEN";

  constructor() {
    super("A user with this email already exists")
  }
}

export class InvalidCredentialsError extends DomainError {
  override readonly statusCode: number = 401;
  override readonly code: string = "INVALID_CREDENTIALS";

  constructor() {
    super("Invalid email or password");
  }
}

export class UserNotFoundError extends DomainError {
  override readonly statusCode: number = 404;
  override readonly code: string = "USER_NOT_FOUND";

  constructor() {
    super("User not found");
  }
}
