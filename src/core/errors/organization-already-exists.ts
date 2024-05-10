import { UseCaseError } from "~/core/errors/use-case-error";

export class OrganizationAlreadyExists extends Error implements UseCaseError {
  constructor() {
    super("Organization already exists");
  }
}
