import { OrganizationMapper } from "~/domain/organization/application/mappers/organization-mapper";
import { DatabaseConnection } from "~/infra/database/connection";

import type { OrganizationRepository } from "~/domain/organization/application/repository/organization-repository";
import type { Organization } from "~/domain/organization/enterprise/entities/organization";

export class PrismaOrganizationRepository implements OrganizationRepository {
  public async create(organization: Organization): Promise<Organization> {
    await DatabaseConnection.query.organization.create({
      data: OrganizationMapper.toPersistence(organization),
    });

    return organization;
  }

  public async findByEmail(email: string): Promise<Organization | null> {
    const organizationByEmail = await DatabaseConnection.query.organization.findUnique({
      where: {
        email,
      },
    });

    if (!organizationByEmail) return null;

    return await OrganizationMapper.toDomain(organizationByEmail);
  }

  public async findById(id: string): Promise<Organization | null> {
    const organizationById = await DatabaseConnection.query.organization.findUnique({
      where: {
        id,
      },
    });

    if (!organizationById) return null;

    return await OrganizationMapper.toDomain(organizationById);
  }

  public async save(organization: Organization): Promise<Organization> {
    await DatabaseConnection.query.organization.update({
      where: {
        id: organization.id.toValue(),
      },
      data: OrganizationMapper.toPersistence(organization),
    });

    return organization;
  }
}
