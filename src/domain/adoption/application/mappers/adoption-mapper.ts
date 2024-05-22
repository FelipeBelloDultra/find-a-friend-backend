import { UniqueEntityID } from "~/core/entity/unique-entity-id";

import { Adoption } from "../../enterprise/entities/adoption";

import type { Adoption as DatabaseAdoption } from "@prisma/client";

export class AdoptionMapper {
  public static toDomain(toPersistence: DatabaseAdoption): Adoption {
    const petId = new UniqueEntityID(toPersistence.pet_id);
    const organizationId = new UniqueEntityID(toPersistence.organization_id);
    const id = new UniqueEntityID(toPersistence.id);

    const adoption = Adoption.create(
      {
        adopterEmail: toPersistence.adopter_email,
        adopterName: toPersistence.adopter_name,
        adopterPhone: toPersistence.adopter_phone,
        createdAt: toPersistence.created_at,
        petId,
        organizationId,
      },
      id,
    );

    return adoption;
  }

  public static toPersistence(fromDomainAdoption: Adoption): DatabaseAdoption {
    return {
      adopter_email: fromDomainAdoption.values.adopterEmail,
      adopter_name: fromDomainAdoption.values.adopterName,
      adopter_phone: fromDomainAdoption.values.adopterPhone,
      created_at: fromDomainAdoption.values.createdAt,
      id: fromDomainAdoption.id.toValue(),
      pet_id: fromDomainAdoption.values.petId.toValue(),
      organization_id: fromDomainAdoption.values.organizationId.toValue(),
    };
  }
}
