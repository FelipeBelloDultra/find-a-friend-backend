import { Pet } from "~/domain/pet/enterprise/entities/pet";

export interface PetRepository {
  create: (pet: Pet) => Promise<Pet>;
}
