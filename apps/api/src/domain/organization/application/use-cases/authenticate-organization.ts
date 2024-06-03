import { Injectable } from "@nestjs/common";

import { Either, left, right } from "~/core/either";
import { OrganizationRepository } from "~/domain/organization/application/repository/organization-repository";
import { Encrypter } from "~/application/cryptography/encrypter";

import { InvalidCredentials } from "./errors/invalid-credentials";

interface AuthenticateOrganizationInput {
  email: string;
  password: string;
}

type AuthenticateOrganizationOutput = Either<InvalidCredentials, { accessToken: string; refreshToken: string }>;

@Injectable()
export class AuthenticateOrganization {
  public constructor(
    private readonly organizationRepository: OrganizationRepository,
    private readonly encrypter: Encrypter,
  ) {}

  public async execute(input: AuthenticateOrganizationInput): Promise<AuthenticateOrganizationOutput> {
    const org = await this.organizationRepository.findByEmail(input.email);
    if (!org) {
      return left(new InvalidCredentials());
    }

    const doesPasswordMatch = await org.values.password.comparePassword(input.password);
    if (!doesPasswordMatch) {
      return left(new InvalidCredentials());
    }

    const [accessToken, refreshToken] = await Promise.all([
      this.encrypter.encrypt({
        sub: org.id.toValue(),
      }),
      this.encrypter.encrypt(
        {
          sub: org.id.toValue(),
        },
        "7d",
      ),
    ]);

    return right({
      accessToken,
      refreshToken,
    });
  }
}
