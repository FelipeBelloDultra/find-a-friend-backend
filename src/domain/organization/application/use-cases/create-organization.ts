import { Injectable } from "@nestjs/common";

import { Either, left, right } from "~/core/either";
import { Organization } from "~/domain/organization/enterprise/entities/organization";
import { Password } from "~/domain/organization/enterprise/entities/value-object/password";
import { env } from "~/config/env";
import { OrganizationRepository } from "~/domain/organization/application/repository/organization-repository";
import { UseCase } from "~/application/use-case";

import { OrganizationAlreadyExists } from "./errors/organization-already-exists";

interface CreateOrganizationInput {
  name: string;
  email: string;
  password: string;
  phone: string;
}
type OnLeft = OrganizationAlreadyExists;
type OnRight = { organization: Organization };

type CreateOrganizationOutput = Promise<Either<OnLeft, OnRight>>;
@Injectable()
export class CreateOrganization implements UseCase<CreateOrganizationInput, CreateOrganizationOutput> {
  public constructor(private readonly organizationRepository: OrganizationRepository) {}

  public async execute(input: CreateOrganizationInput): CreateOrganizationOutput {
    const findedByEmail = await this.organizationRepository.findByEmail(input.email);
    if (findedByEmail) {
      return left(new OrganizationAlreadyExists());
    }

    const organization = Organization.create({
      name: input.name,
      logoUrl: env.DEFAULT_LOGO_PLACEHOLDER,
      phone: input.phone,
      email: input.email,
      password: await Password.create(input.password),
    });

    return right({
      organization: await this.organizationRepository.create(organization),
    });
  }
}
