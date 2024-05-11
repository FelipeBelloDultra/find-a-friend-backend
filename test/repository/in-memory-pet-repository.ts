import { PaginationRepository } from "~/core/repository/pagination-repository";

import {
  FindAllPetsParams,
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
    params: FindAllPetsParams,
    { page }: PaginationRepository
  ): Promise<Pet[]> {
    const orgsByCity = await this.organizationRepository.organizations.filter(
      (organization) => {
        if (
          organization.address &&
          organization.address.value.city === params.city
        ) {
          return organization;
        }
      }
    );

    const pets = this.pets.filter((pet) =>
      orgsByCity.some((org) => org.id.equals(pet.organizationId))
    );

    return pets.slice((page - 1) * 20, page * 20);
  }
}
