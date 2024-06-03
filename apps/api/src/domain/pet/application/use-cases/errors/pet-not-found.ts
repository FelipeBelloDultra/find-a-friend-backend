import { UseCaseError } from "~/application/errors/use-case-error";

export class PetNotFound extends Error implements UseCaseError {
  public constructor() {
    super("Pet not found");
  }
}
