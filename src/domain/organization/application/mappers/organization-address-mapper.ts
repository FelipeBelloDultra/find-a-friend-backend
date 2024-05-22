import { type OrganizationAddress as DatabaseOrganizationAddress, Prisma } from "@prisma/client";

import { OrganizationAddress } from "~/domain/organization/enterprise/entities/organization-address";
import { UniqueEntityID } from "~/core/entity/unique-entity-id";

export class OrganizationAddressMapper {
  public static toDomain(fromPersistence: DatabaseOrganizationAddress): OrganizationAddress {
    const id = new UniqueEntityID(fromPersistence.id);

    const organizationAddress = OrganizationAddress.create(
      {
        organizationId: new UniqueEntityID(fromPersistence.organization_id),
        city: fromPersistence.city,
        complement: fromPersistence.complement,
        latitude: Number(fromPersistence.latitude),
        longitude: Number(fromPersistence.longitude),
        state: fromPersistence.state,
        street: fromPersistence.street,
        neighborhood: fromPersistence.neighborhood,
        number: fromPersistence.number,
        zipcode: fromPersistence.zipcode,
        createdAt: fromPersistence.created_at,
        updatedAt: fromPersistence.updated_at,
      },
      id,
    );

    return organizationAddress;
  }

  public static toPersistence(organizationAddressToPersistence: OrganizationAddress): DatabaseOrganizationAddress {
    const {
      organizationId,
      city,
      number,
      complement,
      latitude,
      longitude,
      state,
      street,
      neighborhood,
      zipcode,
      createdAt,
      updatedAt,
    } = organizationAddressToPersistence.values;

    return {
      organization_id: organizationId.toValue(),
      id: organizationAddressToPersistence.id.toValue(),
      city,
      complement,
      latitude: new Prisma.Decimal(latitude),
      longitude: new Prisma.Decimal(longitude),
      state,
      street,
      neighborhood,
      number,
      zipcode,
      created_at: createdAt,
      updated_at: updatedAt,
    };
  }
}
