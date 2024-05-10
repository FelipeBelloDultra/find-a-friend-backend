import { UseCase } from "~/core/entity/use-case";
import { Either, left, right } from "~/core/either";

import { OrganizationAddressRepository } from "~/domain/organization/application/repository/organization-address-repository";
import { OrganizationRepository } from "~/domain/organization/application/repository/organization-repository";
import { Address } from "~/domain/organization/enterprise/entities/address";

import { OrganizationNotFound } from "./errors/organization-not-found";

interface CreateOrganizationAddressInput {
  organizationId: string;
  street: string;
  city: string;
  zipcode: string;
  country: string;
  neighborhood: string;
  number: string;
  complement: string | null;
}
type OnLeft = OrganizationNotFound;
type OnRight = { address: Address };

type CreateOrganizationAddressOutput = Promise<Either<OnLeft, OnRight>>;

export class CreateOrganizationAddress
  implements
    UseCase<CreateOrganizationAddressInput, CreateOrganizationAddressOutput>
{
  constructor(
    private readonly organizationAddressRepository: OrganizationAddressRepository,
    private readonly organizationRepository: OrganizationRepository
  ) {}

  async execute(
    input: CreateOrganizationAddressInput
  ): CreateOrganizationAddressOutput {
    const org = await this.organizationRepository.findById(
      input.organizationId
    );
    if (!org) {
      return left(new OrganizationNotFound());
    }

    const address = Address.create({
      city: input.city,
      complement: input.complement,
      country: input.country,
      neighborhood: input.neighborhood,
      number: input.number,
      street: input.street,
      zipcode: input.zipcode,
      organizationId: org.id,
    });

    return right({
      address: await this.organizationAddressRepository.create(address),
    });
  }
}
