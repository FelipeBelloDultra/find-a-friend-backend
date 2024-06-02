import { Pet } from "~/domain/pet/enterprise/entities/pet";

export class PetPresenter {
  public static toHTTP(pet: Pet) {
    return {
      id: pet.id.toValue(),
      adoption_status: pet.values.adoptionStatus.value,
      organization_id: pet.values.organizationId.toValue(),
      name: pet.values.name,
      created_at: pet.values.createdAt,
      updated_at: pet.values.updatedAt,
      size: pet.values.size,
      about: pet.values.about,
      energy_level: pet.values.energyLevel,
      environment_size: pet.values.environmentSize,
    };
  }
}
