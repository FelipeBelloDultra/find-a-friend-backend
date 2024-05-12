import { type UseCase } from "~/application/use-case";
import { type Either, right } from "~/core/either";

import { type PetRepository } from "~/domain/pet/application/repository/pet-repository";
import { type Pet } from "~/domain/pet/enterprise/entities/pet";

interface FetchManyPetsInput {
  city: string;
  size?: "SMALL" | "MEDIUM" | "LARGE";
  energyLevel?: "LOW" | "MODERATE" | "MEDIUM" | "HIGH";
  environment?: "SMALL" | "MEDIUM" | "LARGE";
  adopted?: boolean;
  page: number;
  limit: number;
}
type OnLeft = never;
type OnRight = { pets: Array<Pet> };

type FetchManyPetsOutput = Promise<Either<OnLeft, OnRight>>;

export class FetchManyPets implements UseCase<FetchManyPetsInput, FetchManyPetsOutput> {
  constructor(private readonly petRepository: PetRepository) {}

  async execute(input: FetchManyPetsInput): FetchManyPetsOutput {
    const pets = await this.petRepository.findAll(
      {
        city: input.city,
        size: input.size,
        energyLevel: input.energyLevel,
        environment: input.environment,
        adopted: input.adopted,
      },
      {
        limit: input.limit,
        page: input.page,
      },
    );

    return right({
      pets,
    });
  }
}
