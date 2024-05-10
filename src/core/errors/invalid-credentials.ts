import { UseCaseError } from "~/core/errors/use-case-error";

export class InvalidCredentials extends Error implements UseCaseError {
  constructor() {
    super("Invalid credentials");
  }
}
