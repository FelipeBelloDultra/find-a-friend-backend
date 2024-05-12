import { Organization as DatabaseOrganization, Prisma } from "@prisma/client";
import { UniqueEntityID } from "~/core/entity/unique-entity-id";

import { Organization } from "~/domain/organization/enterprise/entities/organization";
import { Password } from "~/domain/organization/enterprise/entities/value-object/password";
import { Address } from "~/domain/organization/enterprise/entities/value-object/address";

export class OrganizationMapper {
  static async toDomain(fromPersistence: DatabaseOrganization): Promise<Organization> {
    const password = await Password.create(fromPersistence.password_hash, true);
    const id = new UniqueEntityID(fromPersistence.id);
    const address = Address.getInstanceOrNull({
      city: fromPersistence.city,
      complement: fromPersistence.complement,
      latitude: Number(fromPersistence.latitude),
      longitude: Number(fromPersistence.longitude),
      state: fromPersistence.state,
      street: fromPersistence.street,
      neighborhood: fromPersistence.neighborhood,
      number: fromPersistence.number,
      zipcode: fromPersistence.zipcode,
    });

    const organization = Organization.create(
      {
        name: fromPersistence.name,
        email: fromPersistence.email,
        logoUrl: fromPersistence.logo_url,
        password,
        phone: fromPersistence.phone,
        address,
        createdAt: fromPersistence.created_at,
        updatedAt: fromPersistence.updated_at,
      },
      id,
    );

    return organization;
  }

  static toPersistence(organizationToPersistence: Organization): DatabaseOrganization {
    const { id, name, email, logoUrl, password, phone, address, createdAt, updatedAt } = organizationToPersistence;

    return {
      id: id.toValue(),
      email: email,
      name: name,
      logo_url: logoUrl,
      password_hash: password.value,
      phone: phone,
      city: address?.value.city || "",
      complement: address?.value.complement || "",
      latitude: new Prisma.Decimal(address?.value.latitude || 0),
      longitude: new Prisma.Decimal(address?.value.longitude || 0),
      state: address?.value.state || "",
      street: address?.value.street || "",
      neighborhood: address?.value.neighborhood || "",
      number: address?.value.number || "",
      zipcode: address?.value.zipcode || "",
      updated_at: updatedAt,
      created_at: createdAt,
    };
  }
}
