import { Injectable } from "@nestjs/common";

import { Either, left, right } from "~/core/either";
import { OrganizationNotFound } from "~/domain/organization/application/use-cases/errors/organization-not-found";
import { NotAllowed } from "~/core/errors/not-allowed";
import { Pet, PetEnergyLevel, PetEnvironmentSize, PetSize } from "~/domain/pet/enterprise/entities/pet";
import { OrganizationAddressNotFound } from "~/domain/organization/application/use-cases/errors/organization-address-not-found";
import { OrganizationAddressRepository } from "~/domain/organization/application/repository/organization-address-repository";
import { PetRepository } from "~/domain/pet/application/repository/pet-repository";
import { OrganizationRepository } from "~/domain/organization/application/repository/organization-repository";

import { AdoptionStatus } from "../../enterprise/entities/value-object/adoption-status";

interface CreatePetInput {
  organizationId: string;
  organizationAddressId: string;
  name: string;
  about: string;
  size: PetSize;
  energyLevel: PetEnergyLevel;
  environmentSize: PetEnvironmentSize;
}

type CreatePetOutput = Either<OrganizationNotFound | OrganizationAddressNotFound | NotAllowed, { pet: Pet }>;

@Injectable()
export class CreatePet {
  public constructor(
    private readonly organizationRepository: OrganizationRepository,
    private readonly organizationAddressRepository: OrganizationAddressRepository,
    private readonly petRepository: PetRepository,
  ) {}

  public async execute(input: CreatePetInput): Promise<CreatePetOutput> {
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
