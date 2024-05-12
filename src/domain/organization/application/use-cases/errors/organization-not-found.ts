import { type UseCaseError } from "~/application/errors/use-case-error";

export class OrganizationNotFound extends Error implements UseCaseError {
  constructor() {
    super("Organization not found");
  }
}
