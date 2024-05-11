import { UseCase } from "~/core/entity/use-case";
import { Either, left, right } from "~/core/either";
import { PetNotFound } from "~/core/errors/pet-not-found";
import { OrganizationNotFound } from "~/core/errors/organization-not-found";
import { NotAllowed } from "~/core/errors/not-allowed";

import { PetRepository } from "~/domain/pet/application/repository/pet-repository";
import { OrganizationRepository } from "~/domain/organization/application/repository/organization-repository";
import { AdoptionRepository } from "~/domain/adoption/application/repository/adoption-repository";
import { Adoption } from "~/domain/adoption/enterprise/entities/adoption";

interface AdoptPetInput {
  petId: string;
  organizationId: string;
  adopterName: string;
  adopterPhone: string;
}
type OnLeft = PetNotFound | OrganizationNotFound | NotAllowed;
type OnRight = { adoption: Adoption };

type AdoptPetOutput = Promise<Either<OnLeft, OnRight>>;

export class AdoptPet implements UseCase<AdoptPetInput, AdoptPetOutput> {
  constructor(
    private readonly adoptionRepository: AdoptionRepository,
    private readonly organizationRepository: OrganizationRepository,
    private readonly petRepository: PetRepository
  ) {}

  async execute(input: AdoptPetInput): AdoptPetOutput {
    const organization = await this.organizationRepository.findById(
      input.organizationId
    );
    if (!organization) {
      return left(new OrganizationNotFound());
    }

    const pet = await this.petRepository.findById(input.petId);
    if (!pet) {
      return left(new PetNotFound());
    }

    const petIsFromSameOrganization = organization.id.equals(
      pet.organizationId
    );

    if (!petIsFromSameOrganization || !organization.canContinue()) {
      return left(new NotAllowed());
    }

    pet.adopt();

    const adoption = Adoption.create({
      adopterName: input.adopterName,
      adopterPhone: input.adopterPhone,
      petId: pet.id,
      organizationId: organization.id,
    });

    await Promise.all([
      this.adoptionRepository.create(adoption),
      this.petRepository.save(pet),
    ]);

    return right({
      adoption: adoption,
    });
  }
}
