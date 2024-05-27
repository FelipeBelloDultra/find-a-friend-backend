import { Either, left, right } from "~/core/either";
import { PetNotFound } from "~/domain/pet/application/use-cases/errors/pet-not-found";
import { PetRepository } from "~/domain/pet/application/repository/pet-repository";
import { UseCase } from "~/application/use-case";
import { AdoptionRepository } from "~/domain/adoption/application/repository/adoption-repository";
import { Adoption } from "~/domain/adoption/enterprise/entities/adoption";

import { AdoptionCodeExpired } from "./errors/adoption-code-expired";
import { AdoptionNotFound } from "./errors/adoption-not-found";

interface VerifyAdoptionCodeInput {
  adoptionCode: string;
}
type OnLeft = AdoptionNotFound | AdoptionCodeExpired | PetNotFound;
type OnRight = { adoption: Adoption };

type VerifyAdoptionCodeOutput = Promise<Either<OnLeft, OnRight>>;

export class VerifyAdoptionCode implements UseCase<VerifyAdoptionCodeInput, VerifyAdoptionCodeOutput> {
  public constructor(
    private readonly petRepository: PetRepository,
    private readonly adoptionRepository: AdoptionRepository,
  ) {}

  public async execute(input: VerifyAdoptionCodeInput): VerifyAdoptionCodeOutput {
    const adoption = await this.adoptionRepository.findByCode(input.adoptionCode);
    if (!adoption) {
      return left(new AdoptionNotFound());
    }

    const pet = await this.petRepository.findById(adoption.values.petId.toValue());
    if (!pet) {
      return left(new PetNotFound());
    }

    if (adoption.values.expiresAt.isExpired() || adoption.wasConfirmed()) {
      pet.cancelAdoption();
      await this.petRepository.save(pet);

      return left(new AdoptionCodeExpired());
    }

    adoption.confirmAdoption();
    pet.completeAdoption();
    await Promise.all([this.adoptionRepository.save(adoption), this.petRepository.save(pet)]);

    return right({
      adoption,
    });
  }
}
