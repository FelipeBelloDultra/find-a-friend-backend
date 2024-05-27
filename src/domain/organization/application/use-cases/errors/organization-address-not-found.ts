import { UseCaseError } from "~/application/errors/use-case-error";

export class OrganizationAddressNotFound extends Error implements UseCaseError {
  public constructor() {
    super("OrganizationAddress not found");
  }
}
