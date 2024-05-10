import { PetRepository } from "~/domain/pet/application/repository/pet-repository";
import { Pet } from "~/domain/pet/enterprise/entities/pet";

export class InMemoryPetRepository implements PetRepository {
  public readonly pets: Array<Pet> = [];

  async create(pet: Pet): Promise<Pet> {
    this.pets.push(pet);

    return pet;
  }
}
