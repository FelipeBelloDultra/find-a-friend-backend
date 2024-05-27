import { Pet as DatabasePet } from "@prisma/client";

import { UniqueEntityID } from "~/core/entity/unique-entity-id";
import { Pet } from "~/domain/pet/enterprise/entities/pet";
import { AdoptionStatus } from "~/domain/pet/enterprise/entities/value-object/adoption-status";

export class PetMapper {
  public static toDomain(fromPersistence: DatabasePet): Pet {
    const organizationId = new UniqueEntityID(fromPersistence.organization_id);
    const organizationAddressId = new UniqueEntityID(fromPersistence.organization_address_id);
    const id = new UniqueEntityID(fromPersistence.id);
    const adoptionStatus = AdoptionStatus.create(fromPersistence.adoption_status);

    const pet = Pet.create(
      {
        about: fromPersistence.about,
        energyLevel: fromPersistence.energy_level,
        environmentSize: fromPersistence.environment_size,
        name: fromPersistence.name,
        size: fromPersistence.size,
        organizationId,
        organizationAddressId,
        adoptionStatus,
        createdAt: fromPersistence.created_at,
        updatedAt: fromPersistence.updated_at,
      },
      id,
    );

    return pet;
  }

  public static toPersistence(petToPersistence: Pet): DatabasePet {
    return {
      about: petToPersistence.values.about,
      adoption_status: petToPersistence.values.adoptionStatus.value,
      energy_level: petToPersistence.values.energyLevel,
      environment_size: petToPersistence.values.environmentSize,
      name: petToPersistence.values.name,
      size: petToPersistence.values.size,
      created_at: petToPersistence.values.createdAt,
      updated_at: petToPersistence.values.updatedAt,
      organization_id: petToPersistence.values.organizationId.toValue(),
      organization_address_id: petToPersistence.values.organizationAddressId.toValue(),
      id: petToPersistence.id.toValue(),
    };
  }
}
