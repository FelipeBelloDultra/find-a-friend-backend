import { PaginationRepository } from "~/core/repository/pagination-repository";

import {
  FindAllPetsFilters,
  PetRepository,
} from "~/domain/pet/application/repository/pet-repository";
import { Pet } from "~/domain/pet/enterprise/entities/pet";

import { InMemoryOrganizationRepository } from "./in-memory-organization-repository";

export class InMemoryPetRepository implements PetRepository {
  public readonly pets: Array<Pet> = [];

  constructor(private organizationRepository: InMemoryOrganizationRepository) {}

  async create(pet: Pet): Promise<Pet> {
    this.pets.push(pet);

    return pet;
  }

  async findAll(
    params: FindAllPetsFilters,
    { limit, page }: PaginationRepository
  ): Promise<Pet[]> {
    const orgsByCity = this.organizationRepository.organizations.filter(
      (organization) => {
        if (
          organization.address &&
          organization.address.value.city === params.city
        ) {
          return organization;
        }
      }
    );

    const pets = this.pets
      .filter((pet) =>
        orgsByCity.some((org) => org.id.equals(pet.organizationId))
      )
      .filter((pet) => (params.size ? pet.size === params.size : true))
      .filter((pet) =>
        params.energyLevel ? pet.energyLevel === params.energyLevel : true
      )
      .filter((pet) =>
        params.environment ? pet.environment === params.environment : true
      );

    const SKIP = (page - 1) * limit;
    const TAKE = page * limit;

    return pets.slice(SKIP, TAKE);
  }
}
