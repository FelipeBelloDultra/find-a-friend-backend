import { UseCase } from "~/core/entity/use-case";
import { Either, right } from "~/core/either";

import { PetRepository } from "~/domain/pet/application/repository/pet-repository";
import { Pet } from "~/domain/pet/enterprise/entities/pet";

interface FetchManyPetsInput {
  city: string;
  page: number;
  limit: number;
}
type OnLeft = null;
type OnRight = { pets: Array<Pet> };

type FetchManyPetsOutput = Promise<Either<OnLeft, OnRight>>;

export class FetchManyPets
  implements UseCase<FetchManyPetsInput, FetchManyPetsOutput>
{
  constructor(private readonly petRepository: PetRepository) {}

  async execute(input: FetchManyPetsInput): FetchManyPetsOutput {
    const pets = await this.petRepository.findAll(
      {
        city: input.city,
      },
      {
        limit: input.limit,
        page: input.page,
      }
    );

    return right({
      pets,
    });
  }
}
