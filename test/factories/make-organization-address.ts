import { faker } from "@faker-js/faker";

import { UniqueEntityID } from "~/core/entity/unique-entity-id";
import {
  OrganizationAddress,
  OrganizationAddressProps,
} from "~/domain/organization/enterprise/entities/organization-address";

import { PrismaOrganizationAddressRepository } from "~/infra/repository/prisma-organization-address-repository";

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

export async function makeOrganizationAddressRequest(organizationId: UniqueEntityID) {
  const organizationAddress = makeOrganizationAddressEntity({
    organizationId,
  });

  const prismaOrganizationAddressRepository = new PrismaOrganizationAddressRepository();

  await prismaOrganizationAddressRepository.create(organizationAddress);

  return { organizationAddress };
}
