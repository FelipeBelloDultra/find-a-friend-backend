import { Injectable } from "@nestjs/common";

import { OrganizationMapper } from "../mappers/organization-mapper";

import type { PrismaService } from "../prisma.service";
import type { OrganizationRepository } from "~/domain/organization/application/repository/organization-repository";
import type { Organization } from "~/domain/organization/enterprise/entities/organization";

@Injectable()
export class PrismaOrganizationRepository implements OrganizationRepository {
  public constructor(private readonly prisma: PrismaService) {}

  public async create(organization: Organization): Promise<Organization> {
    await this.prisma.organization.create({
      data: OrganizationMapper.toPersistence(organization),
    });

    return organization;
  }

  public async findByEmail(email: string): Promise<Organization | null> {
    const organizationByEmail = await this.prisma.organization.findUnique({
      where: {
        email,
      },
    });

    if (!organizationByEmail) return null;

    return await OrganizationMapper.toDomain(organizationByEmail);
  }

  public async findById(id: string): Promise<Organization | null> {
    const organizationById = await this.prisma.organization.findUnique({
      where: {
        id,
      },
    });

    if (!organizationById) return null;

    return await OrganizationMapper.toDomain(organizationById);
  }

  public async save(organization: Organization): Promise<Organization> {
    await this.prisma.organization.update({
      where: {
        id: organization.id.toValue(),
      },
      data: OrganizationMapper.toPersistence(organization),
    });

    return organization;
  }
}
