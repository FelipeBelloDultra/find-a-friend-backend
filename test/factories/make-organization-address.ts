import { faker } from "@faker-js/faker";
import { Injectable } from "@nestjs/common";

import { UniqueEntityID } from "~/core/entity/unique-entity-id";
import {
  OrganizationAddress,
  OrganizationAddressProps,
} from "~/domain/organization/enterprise/entities/organization-address";
import { OrganizationAddressMapper } from "~/infra/database/prisma/mappers/organization-address-mapper";
import { PrismaService } from "~/infra/database/prisma/prisma.service";

export function makeOrganizationAddress() {
  return {
    organizationId: new UniqueEntityID(),
    zipcode: faker.location.zipCode(),
    state: faker.location.state(),
    city: faker.location.city(),
    neighborhood: faker.location.country(),
    street: faker.location.street(),
    number: faker.location.buildingNumber(),
    latitude: faker.location.latitude(),
    longitude: faker.location.longitude(),
    complement: faker.lorem.word({ length: { max: 254, min: 10 } }),
  };
}

export function makeOrganizationAddressEntity(override: Partial<OrganizationAddressProps> = {}, id?: UniqueEntityID) {
  const address = OrganizationAddress.create(
    {
      ...makeOrganizationAddress(),
      ...override,
    },
    id,
  );

  return address;
}

@Injectable()
export class OrganizationAddressFactory {
  public constructor(private prisma: PrismaService) {}

  public async makePrismaOrganization(data: Partial<OrganizationAddressProps> = {}): Promise<OrganizationAddress> {
    const organizationAddress = makeOrganizationAddressEntity(data);

    await this.prisma.organizationAddress.create({
      data: OrganizationAddressMapper.toPersistence(organizationAddress),
    });

    return organizationAddress;
  }
}
