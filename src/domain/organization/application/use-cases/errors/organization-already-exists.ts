import { UseCaseError } from "~/application/errors/use-case-error";

export class OrganizationAlreadyExists extends Error implements UseCaseError {
  public constructor() {
    super("Organization already exists");
  }
}
