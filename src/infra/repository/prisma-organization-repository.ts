import { type OrganizationRepository } from "~/domain/organization/application/repository/organization-repository";
import { type Organization } from "~/domain/organization/enterprise/entities/organization";
import { OrganizationMapper } from "~/domain/organization/application/mappers/organization-mapper";

import { query } from "~/infra/database/connection";

export class PrismaOrganizationRepository implements OrganizationRepository {
  async create(organization: Organization): Promise<Organization> {
    await query.organization.create({
      data: OrganizationMapper.toPersistence(organization),
    });

    return organization;
  }

  async findByEmail(email: string): Promise<Organization | null> {
    const findedByEmail = await query.organization.findUnique({
      where: {
        email,
      },
    });

    if (!findedByEmail) return null;

    return await OrganizationMapper.toDomain(findedByEmail);
  }

  async findById(id: string): Promise<Organization | null> {
    const findedById = await query.organization.findUnique({
      where: {
        id,
      },
    });

    if (!findedById) return null;

    return await OrganizationMapper.toDomain(findedById);
  }

  async save(organization: Organization): Promise<Organization> {
    await query.organization.update({
      where: {
        id: organization.id.toValue(),
      },
      data: OrganizationMapper.toPersistence(organization),
    });

    return organization;
  }
}
