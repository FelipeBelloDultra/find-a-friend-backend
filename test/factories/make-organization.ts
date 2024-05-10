import { faker } from "@faker-js/faker";
import { UniqueEntityID } from "~/core/entity/unique-entity-id";
import {
  Organization,
  OrganizationProps,
} from "~/domain/organization/enterprise/entities/organization";

export function makeOrganization() {
  return {
    logoUrl: faker.image.url(),
    name: faker.company.name(),
    phone: faker.phone.number(),
    email: faker.internet.email(),
    password: faker.internet.password(),
  };
}

export function makeOrganizationEntity(
  override: Partial<OrganizationProps> = {},
  id?: UniqueEntityID
) {
  const organization = Organization.create(
    {
      ...makeOrganization(),
      ...override,
    },
    id
  );

  return organization;
}
