import { DatabaseConnection } from "~/infra/database/connection";
import { OrganizationAddressMapper } from "~/domain/organization/application/mappers/organization-address-mapper";

import type { OrganizationAddress } from "~/domain/organization/enterprise/entities/organization-address";
import type { OrganizationAddressRepository } from "~/domain/organization/application/repository/organization-address-repository";

export class PrismaOrganizationAddressRepository implements OrganizationAddressRepository {
  public async create(organizationAddress: OrganizationAddress): Promise<OrganizationAddress> {
    await DatabaseConnection.query.organizationAddress.create({
      data: OrganizationAddressMapper.toPersistence(organizationAddress),
    });

    return organizationAddress;
  }

  public async findById(organizationAddressId: string): Promise<OrganizationAddress | null> {
    const organizationAddress = await DatabaseConnection.query.organizationAddress.findUnique({
      where: {
        id: organizationAddressId,
      },
    });

    if (!organizationAddress) return null;

    return OrganizationAddressMapper.toDomain(organizationAddress);
  }
}
