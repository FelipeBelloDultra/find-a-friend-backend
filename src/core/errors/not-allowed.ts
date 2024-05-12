import { UseCaseError } from "~/application/errors/use-case-error";

export class NotAllowed extends Error implements UseCaseError {
  constructor() {
    super("Not allowed");
  }
}
