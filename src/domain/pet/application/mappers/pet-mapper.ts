import { UniqueEntityID } from "~/core/entity/unique-entity-id";
import { Pet } from "~/domain/pet/enterprise/entities/pet";

import type { Pet as DatabasePet } from "@prisma/client";

export class PetMapper {
  public static toDomain(fromPersistence: DatabasePet): Pet {
    const organizationId = new UniqueEntityID(fromPersistence.organization_id);
    const organizationAddressId = new UniqueEntityID(fromPersistence.organization_address_id);
    const id = new UniqueEntityID(fromPersistence.id);

    const pet = Pet.create(
      {
        about: fromPersistence.about,
        energyLevel: fromPersistence.energy_level,
        environment: fromPersistence.environment,
        name: fromPersistence.name,
        size: fromPersistence.size,
        organizationId,
        organizationAddressId,
        adopted: fromPersistence.adopted,
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
      adopted: petToPersistence.values.adopted,
      energy_level: petToPersistence.values.energyLevel,
      environment: petToPersistence.values.environment,
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
