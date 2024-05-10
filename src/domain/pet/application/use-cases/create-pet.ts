import { UseCase } from "~/core/entity/use-case";
import { Either, left, right } from "~/core/either";

import { PetRepository } from "~/domain/pet/application/repository/pet-repository";

interface CreatePetInput {
  addressId: string;
  organizationId: string;
  name: string;
  about: string;
  size: "SMALL" | "MEDIUM" | "LARGE";
  energyLevel: "LOW" | "MODERATE" | "MEDIUM" | "HIGH";
  environment: "SMALL" | "MEDIUM" | "LARGE";
}
type OnLeft = null;
type OnRight = null;

type CreatePetOutput = Promise<Either<OnLeft, OnRight>>;

export class CreatePet implements UseCase<CreatePetInput, CreatePetOutput> {
  constructor(private readonly petRepository: PetRepository) {}

  async execute(input: CreatePetInput): CreatePetOutput {
    if (Math.random() >= 0.5) {
      return right(null);
    }

    return left(null);
  }
}
