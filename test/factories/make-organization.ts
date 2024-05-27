import supertest from "supertest";
import { faker } from "@faker-js/faker";
import { FastifyInstance } from "fastify";

import { Organization, OrganizationProps } from "~/domain/organization/enterprise/entities/organization";
import { Password } from "~/domain/organization/enterprise/entities/value-object/password";
import { UniqueEntityID } from "~/core/entity/unique-entity-id";

import { DatabaseConnection } from "~/infra/database/connection";
import { OrganizationMapper } from "~/domain/organization/application/mappers/organization-mapper";

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

export async function makeAndAuthenticateOrganizationRequest(fastifyInstance: FastifyInstance) {
  const organization = await makeOrganizationEntity({
    password: await Password.create("123456"),
  });

  await DatabaseConnection.query.organization.create({
    data: OrganizationMapper.toPersistence(organization),
  });

  const authResponse = await supertest(fastifyInstance.server).post("/api/session").send({
    email: organization.values.email,
    password: "123456",
  });

  const { data } = authResponse.body;

  return { token: data.token, organization };
}
