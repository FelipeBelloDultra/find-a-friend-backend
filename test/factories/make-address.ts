import { faker } from "@faker-js/faker";
import { Address, type AddressProps } from "~/domain/organization/enterprise/entities/value-object/address";

export function makeAddress() {
  return {
    zipcode: faker.location.zipCode(),
    state: faker.location.state(),
    city: faker.location.city(),
    neighborhood: faker.location.country(),
    street: faker.location.street(),
    number: faker.location.buildingNumber(),
    latitude: faker.location.latitude(),
    longitude: faker.location.longitude(),
    complement: faker.lorem.text(),
  };
}

export function makeAddressEntity(override: Partial<AddressProps> = {}) {
  const address = Address.create({
    ...makeAddress(),
    ...override,
  });

  return address;
}
