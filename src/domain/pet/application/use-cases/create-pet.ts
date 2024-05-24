import { left, right } from "~/core/either";
import { OrganizationNotFound } from "~/domain/organization/application/use-cases/errors/organization-not-found";
import { NotAllowed } from "~/core/errors/not-allowed";
import { Pet } from "~/domain/pet/enterprise/entities/pet";
import { OrganizationAddressNotFound } from "~/domain/organization/application/use-cases/errors/organization-address-not-found";

import { AdoptionStatus } from "../../enterprise/entities/value-object/adoption-status";

import type { OrganizationAddressRepository } from "~/domain/organization/application/repository/organization-address-repository";
import type { Either } from "~/core/either";
import type { UseCase } from "~/application/use-case";
import type { PetRepository } from "~/domain/pet/application/repository/pet-repository";
import type { OrganizationRepository } from "~/domain/organization/application/repository/organization-repository";

interface CreatePetInput {
  organizationId: string;
  organizationAddressId: string;
  name: string;
  about: string;
  size: "SMALL" | "MEDIUM" | "LARGE";
  energyLevel: "LOW" | "MODERATE" | "MEDIUM" | "HIGH";
  environmentSize: "SMALL" | "MEDIUM" | "LARGE";
}
type OnLeft = OrganizationNotFound | OrganizationAddressNotFound | NotAllowed;
type OnRight = { pet: Pet };

type CreatePetOutput = Promise<Either<OnLeft, OnRight>>;

export class CreatePet implements UseCase<CreatePetInput, CreatePetOutput> {
  public constructor(
    private readonly organizationRepository: OrganizationRepository,
    private readonly organizationAddressRepository: OrganizationAddressRepository,
    private readonly petRepository: PetRepository,
  ) {}

  public async execute(input: CreatePetInput): CreatePetOutput {
    const organization = await this.organizationRepository.findById(input.organizationId);
    if (!organization) {
      return left(new OrganizationNotFound());
    }

    const organizationAddress = await this.organizationAddressRepository.findById(input.organizationAddressId);
    if (!organizationAddress) {
      return left(new OrganizationAddressNotFound());
    }

    if (!organization.canContinue() || !organizationAddress.values.organizationId.equals(organization.id)) {
      return left(new NotAllowed());
    }

    const pet = Pet.create({
      about: input.about,
      energyLevel: input.energyLevel,
      adoptionStatus: AdoptionStatus.create(),
      environmentSize: input.environmentSize,
      name: input.name,
      size: input.size,
      organizationId: organization.id,
      organizationAddressId: organizationAddress.id,
    });

    return right({
      pet: await this.petRepository.create(pet),
    });
  }
}
