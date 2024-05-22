import type { InMemoryOrganizationAddressRepository } from "./in-memory-organization-address-repository";
import type { PaginationRepository } from "~/application/repository/pagination-repository";
import type { FindAllPetsFilters, PetRepository } from "~/domain/pet/application/repository/pet-repository";
import type { Pet } from "~/domain/pet/enterprise/entities/pet";

export class InMemoryPetRepository implements PetRepository {
  public readonly pets: Array<Pet> = [];

  public constructor(private organizationAddressRepository: InMemoryOrganizationAddressRepository) {}

  public async findById(id: string): Promise<Pet | null> {
    const pet = this.pets.find((pet) => pet.id.toValue() === id);

    if (!pet) return null;

    return pet;
  }

  public async create(pet: Pet): Promise<Pet> {
    this.pets.push(pet);

    return pet;
  }

  public async findAll(params: FindAllPetsFilters, { limit, page }: PaginationRepository): Promise<Pet[]> {
    const orgsByCity = this.organizationAddressRepository.organizationAddresses.filter((organizationAddresses) => {
      if (organizationAddresses.values.city === params.city) {
        return organizationAddresses;
      }
    });

    const pets = this.pets
      .filter((pet) => orgsByCity.some((orgAddress) => orgAddress.id.equals(pet.organizationAddressId)))
      .filter((pet) => (params.adopted ? pet.adopted === params.adopted : true))
      .filter((pet) => (params.size ? pet.size === params.size : true))
      .filter((pet) => (params.energyLevel ? pet.energyLevel === params.energyLevel : true))
      .filter((pet) => (params.environment ? pet.environment === params.environment : true));

    const SKIP = (page - 1) * limit;
    const TAKE = page * limit;

    return pets.slice(SKIP, TAKE);
  }

  public async save(pet: Pet): Promise<Pet> {
    const petIndex = this.pets.findIndex(({ id }) => id === pet.id);

    if (petIndex !== -1) {
      this.pets[petIndex] = pet;
    }

    return pet;
  }
}
