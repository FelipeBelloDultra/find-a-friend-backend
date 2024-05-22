import { UniqueEntityID } from "~/core/entity/unique-entity-id";
import { Organization } from "~/domain/organization/enterprise/entities/organization";
import { Password } from "~/domain/organization/enterprise/entities/value-object/password";

import type { Organization as DatabaseOrganization } from "@prisma/client";

export class OrganizationMapper {
  public static async toDomain(fromPersistence: DatabaseOrganization, totalAddresses = 0): Promise<Organization> {
    const password = await Password.create(fromPersistence.password_hash, true);
    const id = new UniqueEntityID(fromPersistence.id);

    const organization = Organization.create(
      {
        name: fromPersistence.name,
        email: fromPersistence.email,
        logoUrl: fromPersistence.logo_url,
        password,
        phone: fromPersistence.phone,
        createdAt: fromPersistence.created_at,
        updatedAt: fromPersistence.updated_at,
        totalAddresses,
      },
      id,
    );

    return organization;
  }

  public static toPersistence(organizationToPersistence: Organization): DatabaseOrganization {
    const { id, name, email, logoUrl, password, phone, createdAt, updatedAt } = organizationToPersistence;

    return {
      id: id.toValue(),
      email: email,
      name: name,
      logo_url: logoUrl,
      password_hash: password.value,
      phone: phone,
      updated_at: updatedAt,
      created_at: createdAt,
    };
  }
}
