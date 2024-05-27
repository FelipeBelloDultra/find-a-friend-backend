import { Either, left, right } from "~/core/either";
import { UseCase } from "~/application/use-case";
import { PetRepository } from "~/domain/pet/application/repository/pet-repository";
import { Pet } from "~/domain/pet/enterprise/entities/pet";

import { PetNotFound } from "./errors/pet-not-found";

interface ShowPetDetailInput {
  petId: string;
}
type OnLeft = PetNotFound;
type OnRight = { pet: Pet };

type ShowPetDetailOutput = Promise<Either<OnLeft, OnRight>>;

export class ShowPetDetail implements UseCase<ShowPetDetailInput, ShowPetDetailOutput> {
  public constructor(private readonly petRepository: PetRepository) {}

  public async execute(input: ShowPetDetailInput): ShowPetDetailOutput {
    const pet = await this.petRepository.findById(input.petId);
    if (!pet) {
      return left(new PetNotFound());
    }

    return right({
      pet,
    });
  }
}
