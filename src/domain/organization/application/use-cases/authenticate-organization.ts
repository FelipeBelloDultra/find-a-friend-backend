import { left, right } from "~/core/either";

import { InvalidCredentials } from "./errors/invalid-credentials";

import type { UseCase } from "~/application/use-case";
import type { Either } from "~/core/either";
import type { OrganizationRepository } from "~/domain/organization/application/repository/organization-repository";

interface AuthenticateOrganizationInput {
  email: string;
  password: string;
}
type OnLeft = InvalidCredentials;
type OnRight = { id: string; email: string; name: string };

type AuthenticateOrganizationOutput = Promise<Either<OnLeft, OnRight>>;

export class AuthenticateOrganization
  implements UseCase<AuthenticateOrganizationInput, AuthenticateOrganizationOutput>
{
  public constructor(private readonly organizationRepository: OrganizationRepository) {}

  public async execute(input: AuthenticateOrganizationInput): AuthenticateOrganizationOutput {
    const org = await this.organizationRepository.findByEmail(input.email);
    if (!org) {
      return left(new InvalidCredentials());
    }

    const doesPasswordMatch = await org.values.password.comparePassword(input.password);
    if (!doesPasswordMatch) {
      return left(new InvalidCredentials());
    }

    return right({
      email: org.values.email,
      id: org.id.toValue(),
      name: org.values.name,
    });
  }
}
