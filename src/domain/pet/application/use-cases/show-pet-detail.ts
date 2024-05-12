import { UseCase } from "~/application/use-case";

import { Either, right, left } from "~/core/either";
import { PetNotFound } from "~/core/errors/pet-not-found";

import { PetRepository } from "~/domain/pet/application/repository/pet-repository";
import { Pet } from "~/domain/pet/enterprise/entities/pet";

interface ShowPetDetailInput {
  petId: string;
}
type OnLeft = PetNotFound;
type OnRight = { pet: Pet };

type ShowPetDetailOutput = Promise<Either<OnLeft, OnRight>>;

export class ShowPetDetail
  implements UseCase<ShowPetDetailInput, ShowPetDetailOutput>
{
  constructor(private readonly petRepository: PetRepository) {}

  async execute(input: ShowPetDetailInput): ShowPetDetailOutput {
    const pet = await this.petRepository.findById(input.petId);
    if (!pet) {
      return left(new PetNotFound());
    }

    return right({
      pet,
    });
  }
}
