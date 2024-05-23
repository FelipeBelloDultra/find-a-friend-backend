import type { UseCaseError } from "~/application/errors/use-case-error";

export class AdoptionNotFound extends Error implements UseCaseError {
  public constructor() {
    super("Adoption not found");
  }
}
