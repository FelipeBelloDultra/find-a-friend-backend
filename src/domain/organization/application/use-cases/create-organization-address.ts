import { left, right } from "~/core/either";

import { OrganizationAddress } from "../../enterprise/entities/organization-address";

import { OrganizationNotFound } from "./errors/organization-not-found";

import type { UseCase } from "~/application/use-case";
import type { Either } from "~/core/either";
import type { OrganizationRepository } from "~/domain/organization/application/repository/organization-repository";
import type { OrganizationAddressRepository } from "../repository/organization-address-repository";

interface CreateOrganizationAddressInput {
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
type OnRight = { organizationAddress: OrganizationAddress };

type CreateOrganizationAddressOutput = Promise<Either<OnLeft, OnRight>>;

export class CreateOrganizationAddress
  implements UseCase<CreateOrganizationAddressInput, CreateOrganizationAddressOutput>
{
  public constructor(
    private readonly organizationRepository: OrganizationRepository,
    private readonly organizationAddressRepository: OrganizationAddressRepository,
  ) {}

  public async execute(input: CreateOrganizationAddressInput): CreateOrganizationAddressOutput {
    const organization = await this.organizationRepository.findById(input.organizationId);
    if (!organization) {
      return left(new OrganizationNotFound());
    }

    const organizationAddress = OrganizationAddress.create({
      zipcode: input.zipcode,
      state: input.state,
      city: input.city,
      neighborhood: input.neighborhood,
      street: input.street,
      number: input.number,
      latitude: input.latitude,
      longitude: input.longitude,
      complement: input.complement,
      organizationId: organization.id,
    });

    return right({
      organizationAddress: await this.organizationAddressRepository.create(organizationAddress),
    });
  }
}
