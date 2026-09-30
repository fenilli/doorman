import { Type } from "typebox";

export abstract class DomainError extends Error {
  readonly statusCode: number = 400;
  readonly code: string = "BAD_REQUEST";

  constructor(message: string) {
    super(message);
    this.name = this.constructor.name;
  }
}

export const DomainErrorSchema = Type.Object({
  message: Type.String(),
  code: Type.String(),
});
