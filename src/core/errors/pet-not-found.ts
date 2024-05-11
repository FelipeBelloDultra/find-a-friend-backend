import { UseCaseError } from "./use-case-error";

export class PetNotFound extends Error implements UseCaseError {
  constructor() {
    super("Pet not found");
  }
}
