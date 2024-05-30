import { faker } from "@faker-js/faker";
import { Injectable } from "@nestjs/common";

import { Organization, OrganizationProps } from "~/domain/organization/enterprise/entities/organization";
import { Password } from "~/domain/organization/enterprise/entities/value-object/password";
import { UniqueEntityID } from "~/core/entity/unique-entity-id";
import { PrismaService } from "~/infra/database/prisma/prisma.service";
import { OrganizationMapper } from "~/infra/database/prisma/mappers/organization-mapper";

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

@Injectable()
export class OrganizationFactory {
  public constructor(private prisma: PrismaService) {}

  public async makePrismaOrganization(data: Partial<OrganizationProps> = {}): Promise<Organization> {
    const organization = await makeOrganizationEntity(data);

    await this.prisma.organization.create({
      data: OrganizationMapper.toPersistence(organization),
    });

    return organization;
  }
}
