import { UseCaseError } from "~/core/errors/use-case-error";

export class OrganizationNotFound extends Error implements UseCaseError {
  constructor() {
    super("Organization not found");
  }
}
