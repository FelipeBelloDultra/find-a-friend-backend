import { Either, right } from "~/core/either";
import { PetEnergyLevel, PetEnvironmentSize, PetSize } from "~/domain/pet/enterprise/entities/pet";
import { PetRepository } from "~/domain/pet/application/repository/pet-repository";

import { FetchManyPetsQuery } from "../query/queries";

interface FetchManyPetsAvailableToAdoptionInput {
  city: string;
  state: string;
  size?: PetSize;
  energyLevel?: PetEnergyLevel;
  environment?: PetEnvironmentSize;
  page: number;
  limit: number;
}

type FetchManyPetsAvailableToAdoptionOutput = Either<
  never,
  {
    pets: Array<
      Omit<FetchManyPetsQuery, "about" | "environment_size" | "size" | "adoption_status" | "created_at" | "updated_at">
    >;
    total: number;
  }
>;

export class FetchManyPetsAvailableToAdoption {
  public constructor(private readonly petRepository: PetRepository) {}

  public async execute(input: FetchManyPetsAvailableToAdoptionInput): Promise<FetchManyPetsAvailableToAdoptionOutput> {
    const { pets, total } = await this.petRepository.findAll(
      {
        city: input.city,
        state: input.state,
        size: input.size,
        energyLevel: input.energyLevel,
        environment: input.environment,
        adoptionStatus: "NOT_ADOPTED",
      },
      {
        limit: input.limit,
        page: input.page,
      },
    );

    return right({
      pets: pets.map((pet) => ({
        id: pet.id,
        organization_address_id: pet.organization_address_id,
        name: pet.name,
        energy_level: pet.energy_level,
        organization_id: pet.organization_id,
      })),
      total,
    });
  }
}
