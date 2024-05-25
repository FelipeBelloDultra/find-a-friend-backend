import { right } from "~/core/either";

import type { FetchManyPetsQuery } from "../query/queries";
import type { UseCase } from "~/application/use-case";
import type { Either } from "~/core/either";
import type { PetRepository } from "~/domain/pet/application/repository/pet-repository";

interface FetchManyPetsInput {
  city: string;
  size?: "SMALL" | "MEDIUM" | "LARGE";
  energyLevel?: "LOW" | "MODERATE" | "MEDIUM" | "HIGH";
  environment?: "SMALL" | "MEDIUM" | "LARGE";
  page: number;
  limit: number;
}
type OnLeft = never;
type OnRight = {
  pets: Array<
    Omit<FetchManyPetsQuery, "about" | "environment_size" | "size" | "adoption_status" | "created_at" | "updated_at">
  >;
};

type FetchManyPetsOutput = Promise<Either<OnLeft, OnRight>>;

export class FetchManyPets implements UseCase<FetchManyPetsInput, FetchManyPetsOutput> {
  public constructor(private readonly petRepository: PetRepository) {}

  public async execute(input: FetchManyPetsInput): FetchManyPetsOutput {
    const pets = await this.petRepository.findAll(
      {
        city: input.city,
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
    });
  }
}
