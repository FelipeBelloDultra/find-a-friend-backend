import { faker } from "@faker-js/faker";
import { UniqueEntityID } from "~/core/entity/unique-entity-id";
import {
  Organization,
  OrganizationProps,
} from "~/domain/organization/enterprise/entities/organization";
import { Password } from "~/domain/organization/enterprise/entities/value-object/password";

export async function makeOrganization() {
  return {
    logoUrl: faker.image.url(),
    name: faker.company.name(),
    phone: faker.phone.number(),
    email: faker.internet.email(),
    password: await Password.create("password"),
  };
}

export async function makeOrganizationEntity(
  override: Partial<OrganizationProps> = {},
  id?: UniqueEntityID
) {
  const organization = Organization.create(
    {
      ...(await makeOrganization()),
      ...override,
    },
    id
  );

  return organization;
}
