import { faker } from "@faker-js/faker";
import { UniqueEntityID } from "~/core/entity/unique-entity-id";
import {
  Address,
  AddressProps,
} from "~/domain/organization/enterprise/entities/address";

export function makeAddress() {
  return {
    city: faker.location.city(),
    country: faker.location.country(),
    neighborhood: faker.location.country(),
    number: faker.location.buildingNumber(),
    street: faker.location.street(),
    zipcode: faker.location.zipCode(),
    complement: faker.lorem.text(),
    organizationId: new UniqueEntityID(),
  };
}

export function makeAddressEntity(
  override: Partial<AddressProps> = {},
  id?: UniqueEntityID
) {
  const address = Address.create(
    {
      ...makeAddress(),
      ...override,
    },
    id
  );

  return address;
}
