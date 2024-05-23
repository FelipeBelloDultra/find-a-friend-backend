import type { UseCaseError } from "~/application/errors/use-case-error";

export class AdoptionCodeExpired extends Error implements UseCaseError {
  public constructor() {
    super("Adoption code expired");
  }
}
