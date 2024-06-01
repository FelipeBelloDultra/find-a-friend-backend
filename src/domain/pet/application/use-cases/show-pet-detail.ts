import { Either, left, right } from "~/core/either";
import { PetRepository } from "~/domain/pet/application/repository/pet-repository";
import { Pet } from "~/domain/pet/enterprise/entities/pet";

import { PetNotFound } from "./errors/pet-not-found";

interface ShowPetDetailInput {
  petId: string;
}

type ShowPetDetailOutput = Either<PetNotFound, { pet: Pet }>;

export class ShowPetDetail {
  public constructor(private readonly petRepository: PetRepository) {}

  public async execute(input: ShowPetDetailInput): Promise<ShowPetDetailOutput> {
    const pet = await this.petRepository.findById(input.petId);
    if (!pet) {
      return left(new PetNotFound());
    }

    return right({
      pet,
    });
  }
}
