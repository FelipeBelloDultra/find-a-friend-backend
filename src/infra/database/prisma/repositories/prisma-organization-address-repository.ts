import { Injectable } from "@nestjs/common";

import { DomainEvents } from "~/core/events/domain-events";
import { OrganizationAddress } from "~/domain/organization/enterprise/entities/organization-address";
import { OrganizationAddressRepository } from "~/domain/organization/application/repository/organization-address-repository";

import { OrganizationAddressMapper } from "../mappers/organization-address-mapper";
import { PrismaService } from "../prisma.service";

@Injectable()
export class PrismaOrganizationAddressRepository implements OrganizationAddressRepository {
  public constructor(private readonly prisma: PrismaService) {}

  public async create(organizationAddress: OrganizationAddress): Promise<OrganizationAddress> {
    await this.prisma.organizationAddress.create({
      data: OrganizationAddressMapper.toPersistence(organizationAddress),
    });

    DomainEvents.dispatchEventsForAggregate(organizationAddress.id);

    return organizationAddress;
  }

  public async findById(organizationAddressId: string): Promise<OrganizationAddress | null> {
    const organizationAddress = await this.prisma.organizationAddress.findUnique({
      where: {
        id: organizationAddressId,
      },
    });

    if (!organizationAddress) return null;

    return OrganizationAddressMapper.toDomain(organizationAddress);
  }
}
