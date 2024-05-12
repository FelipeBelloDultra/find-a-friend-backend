import supertest from "supertest";
import { faker } from "@faker-js/faker";

import { OrganizationMapper } from "~/domain/organization/application/mappers/organization-mapper";
import { Organization } from "~/domain/organization/enterprise/entities/organization";
import { Password } from "~/domain/organization/enterprise/entities/value-object/password";
import { DatabaseConnection } from "~/infra/database/connection";

import type { OrganizationProps } from "~/domain/organization/enterprise/entities/organization";
import type { FastifyInstance } from "fastify";
import type { UniqueEntityID } from "~/core/entity/unique-entity-id";

export async function makeOrganization() {
  return {
    logoUrl: faker.image.url(),
    name: faker.company.name(),
    phone: "+55 (16) 99999-9999",
    email: faker.internet.email(),
    password: await Password.create("password"),
  };
}

export async function makeOrganizationEntity(override: Partial<OrganizationProps> = {}, id?: UniqueEntityID) {
  const organization = Organization.create(
    {
      ...(await makeOrganization()),
      ...override,
    },
    id,
  );

  return organization;
}

export async function makeAndAuthenticateOrganization(fastifyInstance: FastifyInstance) {
  const organization = await makeOrganizationEntity({
    password: await Password.create("123456"),
  });

  await DatabaseConnection.query.organization.create({
    data: OrganizationMapper.toPersistence(organization),
  });

  const authResponse = await supertest(fastifyInstance.server).post("/api/session").send({
    email: organization.email,
    password: "123456",
  });

  const { token } = authResponse.body;

  return { token, organization };
}
