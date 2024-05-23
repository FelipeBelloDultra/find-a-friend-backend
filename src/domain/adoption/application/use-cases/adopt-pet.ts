import { left, right } from "~/core/either";
import { NotAllowed } from "~/core/errors/not-allowed";
import { PetNotFound } from "~/domain/pet/application/use-cases/errors/pet-not-found";
import { OrganizationNotFound } from "~/domain/organization/application/use-cases/errors/organization-not-found";
import { Adoption } from "~/domain/adoption/enterprise/entities/adoption";

import { ExpiresAt } from "../../enterprise/entities/value-object/expires-at";

import type { QueueProvider } from "~/application/providers/queue/queue-provider";
import type { UseCase } from "~/application/use-case";
import type { Either } from "~/core/either";
import type { PetRepository } from "~/domain/pet/application/repository/pet-repository";
import type { OrganizationRepository } from "~/domain/organization/application/repository/organization-repository";
import type { AdoptionRepository } from "~/domain/adoption/application/repository/adoption-repository";

interface AdoptPetInput {
  petId: string;
  organizationId: string;
  adopterEmail: string;
  adopterName: string;
  adopterPhone: string;
}
type OnLeft = PetNotFound | OrganizationNotFound | NotAllowed;
type OnRight = { adoption: Adoption };

type AdoptPetOutput = Promise<Either<OnLeft, OnRight>>;

export class AdoptPet implements UseCase<AdoptPetInput, AdoptPetOutput> {
  public constructor(
    private readonly adoptionRepository: AdoptionRepository,
    private readonly organizationRepository: OrganizationRepository,
    private readonly petRepository: PetRepository,
    private readonly sendAdoptionVerificationCodeQueue: QueueProvider,
  ) {}

  public async execute(input: AdoptPetInput): AdoptPetOutput {
    const organization = await this.organizationRepository.findById(input.organizationId);
    if (!organization) {
      return left(new OrganizationNotFound());
    }

    const pet = await this.petRepository.findById(input.petId);
    if (!pet) {
      return left(new PetNotFound());
    }

    const petIsFromSameOrganization = organization.id.equals(pet.values.organizationId);

    if (!petIsFromSameOrganization || !organization.canContinue()) {
      return left(new NotAllowed());
    }

    pet.intentionToAdopt();

    const adoption = Adoption.create({
      petId: pet.id,
      adopterName: input.adopterName,
      adopterEmail: input.adopterEmail,
      adopterPhone: input.adopterPhone,
      organizationId: organization.id,
      expiresAt: ExpiresAt.create(),
    });

    await Promise.all([
      this.adoptionRepository.create(adoption),
      this.petRepository.save(pet),
      this.sendAdoptionVerificationCodeQueue.addJob({
        petName: pet.values.name,
        adopterName: adoption.values.adopterName,
        adopterEmail: adoption.values.adopterEmail,
        adoptionCode: adoption.values.adoptionCode.toValue(),
        codeExpiresAt: ExpiresAt.EXPIRATION_IN_MINUTES,
      }),
    ]);

    return right({
      adoption: adoption,
    });
  }
}
