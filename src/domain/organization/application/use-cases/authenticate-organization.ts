import { UseCase } from "~/core/entity/use-case";
import { Either, left, right } from "~/core/either";

import { OrganizationRepository } from "~/domain/organization/application/repository/organization-repository";

import { InvalidCredentials } from "./errors/invalid-credentials";

interface AuthenticateOrganizationInput {
  email: string;
  password: string;
}
type OnLeft = InvalidCredentials;
type OnRight = { id: string; email: string; name: string };

type AuthenticateOrganizationOutput = Promise<Either<OnLeft, OnRight>>;

export class AuthenticateOrganization
  implements
    UseCase<AuthenticateOrganizationInput, AuthenticateOrganizationOutput>
{
  constructor(
    private readonly organizationRepository: OrganizationRepository
  ) {}

  async execute(
    input: AuthenticateOrganizationInput
  ): AuthenticateOrganizationOutput {
    const org = await this.organizationRepository.findByEmail(input.email);
    if (!org) {
      return left(new InvalidCredentials());
    }

    const doesPasswordMatch = await org.password.comparePassword(
      input.password
    );
    if (!doesPasswordMatch) {
      return left(new InvalidCredentials());
    }

    return right({
      email: org.email,
      id: org.id.toValue(),
      name: org.name,
    });
  }
}
