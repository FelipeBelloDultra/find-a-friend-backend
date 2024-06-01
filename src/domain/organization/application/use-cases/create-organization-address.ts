import { Injectable } from "@nestjs/common";

import { Either, left, right } from "~/core/either";
import { OrganizationRepository } from "~/domain/organization/application/repository/organization-repository";

import { OrganizationAddress } from "../../enterprise/entities/organization-address";
import { OrganizationAddressRepository } from "../repository/organization-address-repository";

import { OrganizationNotFound } from "./errors/organization-not-found";

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

type CreateOrganizationAddressOutput = Either<OrganizationNotFound, { organizationAddress: OrganizationAddress }>;

@Injectable()
export class CreateOrganizationAddress {
  public constructor(
    private readonly organizationRepository: OrganizationRepository,
    private readonly organizationAddressRepository: OrganizationAddressRepository,
  ) {}

  public async execute(input: CreateOrganizationAddressInput): Promise<CreateOrganizationAddressOutput> {
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
