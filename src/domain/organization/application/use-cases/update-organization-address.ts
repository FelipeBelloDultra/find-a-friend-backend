import { UseCase } from "~/application/use-case";

import { Either, left, right } from "~/core/either";
import { OrganizationNotFound } from "./errors/organization-not-found";

import { OrganizationRepository } from "~/domain/organization/application/repository/organization-repository";
import { Organization } from "~/domain/organization/enterprise/entities/organization";
import { Address } from "~/domain/organization/enterprise/entities/value-object/address";

interface UpdateOrganizationAddressInput {
  organizationId: string;
  zipcode: string;
  state: string;
  city: string;
  neighborhood: string;
  street: string;
  number: string;
  latitude: number;
  longitude: number;
  complement: string | null;
}
type OnLeft = OrganizationNotFound;
type OnRight = { organization: Organization };

type UpdateOrganizationAddressOutput = Promise<Either<OnLeft, OnRight>>;

export class UpdateOrganizationAddress
  implements
    UseCase<UpdateOrganizationAddressInput, UpdateOrganizationAddressOutput>
{
  constructor(
    private readonly organizationRepository: OrganizationRepository
  ) {}

  async execute(
    input: UpdateOrganizationAddressInput
  ): UpdateOrganizationAddressOutput {
    const organization = await this.organizationRepository.findById(
      input.organizationId
    );
    if (!organization) {
      return left(new OrganizationNotFound());
    }

    organization.address = Address.create({
      city: input.city,
      complement: input.complement,
      latitude: input.latitude,
      longitude: input.longitude,
      neighborhood: input.neighborhood,
      number: input.number,
      state: input.state,
      street: input.street,
      zipcode: input.zipcode,
    });

    return right({
      organization: await this.organizationRepository.save(organization),
    });
  }
}
