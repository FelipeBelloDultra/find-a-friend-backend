import { Adoption as DatabaseAdoption } from "@prisma/client";

import { UniqueEntityID } from "~/core/entity/unique-entity-id";
import { Adoption } from "~/domain/adoption/enterprise/entities/adoption";
import { ExpiresAt } from "~/domain/adoption/enterprise/entities/value-object/expires-at";

export class AdoptionMapper {
  public static toDomain(toPersistence: DatabaseAdoption): Adoption {
    const petId = new UniqueEntityID(toPersistence.pet_id);
    const organizationId = new UniqueEntityID(toPersistence.organization_id);
    const adoptionCode = new UniqueEntityID(toPersistence.adoption_code);
    const id = new UniqueEntityID(toPersistence.id);
    const expiresAt = ExpiresAt.create(toPersistence.expires_at);

    const adoption = Adoption.create(
      {
        adopterEmail: toPersistence.adopter_email,
        adopterName: toPersistence.adopter_name,
        adopterPhone: toPersistence.adopter_phone,
        createdAt: toPersistence.created_at,
        confirmedAt: toPersistence.confirmed_at,
        expiresAt,
        adoptionCode,
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
      adoption_code: fromDomainAdoption.values.adoptionCode.toValue(),
      confirmed_at: fromDomainAdoption.values.confirmedAt,
      expires_at: fromDomainAdoption.values.expiresAt.value,
    };
  }
}
