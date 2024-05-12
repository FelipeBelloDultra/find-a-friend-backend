import { type UseCase } from "~/application/use-case";
import { type Either, left, right } from "~/core/either";
import { OrganizationNotFound } from "~/domain/organization/application/use-cases/errors/organization-not-found";
import { NotAllowed } from "~/core/errors/not-allowed";

import { Pet } from "~/domain/pet/enterprise/entities/pet";
import { type PetRepository } from "~/domain/pet/application/repository/pet-repository";
import { type OrganizationRepository } from "~/domain/organization/application/repository/organization-repository";

interface CreatePetInput {
  organizationId: string;
  name: string;
  about: string;
  size: "SMALL" | "MEDIUM" | "LARGE";
  energyLevel: "LOW" | "MODERATE" | "MEDIUM" | "HIGH";
  environment: "SMALL" | "MEDIUM" | "LARGE";
}
type OnLeft = OrganizationNotFound | NotAllowed;
type OnRight = { pet: Pet };

type CreatePetOutput = Promise<Either<OnLeft, OnRight>>;

export class CreatePet implements UseCase<CreatePetInput, CreatePetOutput> {
  constructor(
    private readonly organizationRepository: OrganizationRepository,
    private readonly petRepository: PetRepository,
  ) {}

  async execute(input: CreatePetInput): CreatePetOutput {
    const organization = await this.organizationRepository.findById(input.organizationId);
    if (!organization) {
      return left(new OrganizationNotFound());
    }

    if (!organization.canContinue()) {
      return left(new NotAllowed());
    }

    const pet = Pet.create({
      about: input.about,
      energyLevel: input.energyLevel,
      environment: input.environment,
      name: input.name,
      size: input.size,
      organizationId: organization.id,
    });

    return right({
      pet: await this.petRepository.create(pet),
    });
  }
}
