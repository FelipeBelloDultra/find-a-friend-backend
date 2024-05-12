import type { UseCaseError } from "~/application/errors/use-case-error";

export class InvalidCredentials extends Error implements UseCaseError {
  public constructor() {
    super("Invalid credentials");
  }
}
