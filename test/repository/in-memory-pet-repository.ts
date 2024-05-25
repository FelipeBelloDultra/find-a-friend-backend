import type { FetchManyPetsQuery } from "~/domain/pet/application/query/queries";
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

  public async findAll(
    { adoptionStatus, city, energyLevel, environment, organizationAddressId, organizationId, size }: FindAllPetsFilters,
    { limit, page }: PaginationRepository,
  ): Promise<Array<FetchManyPetsQuery>> {
    const orgsByCity = this.organizationAddressRepository.organizationAddresses.filter((organizationAddresses) => {
      if (organizationAddresses.values.city === city) {
        return organizationAddresses;
      }
    });

    const pets = this.pets
      .filter((pet) => orgsByCity.some((orgAddress) => orgAddress.id.equals(pet.values.organizationAddressId)))
      .filter((pet) => (adoptionStatus ? pet.values.adoptionStatus.value === adoptionStatus : true))
      .filter((pet) => (size ? pet.values.size === size : true))
      .filter((pet) => (energyLevel ? pet.values.energyLevel === energyLevel : true))
      .filter((pet) => (environment ? pet.values.environmentSize === environment : true))
      .filter((pet) =>
        organizationAddressId ? pet.values.organizationAddressId.toValue() === organizationAddressId : true,
      )
      .filter((pet) => (organizationId ? pet.values.organizationId.toValue() === organizationId : true))
      .map((pet) => ({
        about: pet.values.about,
        adoption_status: pet.values.adoptionStatus.value,
        created_at: pet.values.createdAt,
        environment_size: pet.values.environmentSize,
        energy_level: pet.values.energyLevel,
        id: pet.id.toValue(),
        name: pet.values.name,
        organization_address_id: pet.values.organizationAddressId.toValue(),
        organization_id: pet.values.organizationId.toValue(),
        size: pet.values.size,
        updated_at: pet.values.updatedAt,
      }));

    const SKIP = (page - 1) * limit;
    const TAKE = page * limit;

    return pets.slice(SKIP, TAKE);
  }

  public async save(pet: Pet): Promise<Pet> {
    const petIndex = this.pets.findIndex(({ id }) => pet.id.equals(id));

    if (petIndex !== -1) {
      this.pets[petIndex] = pet;
    }

    return pet;
  }
}
