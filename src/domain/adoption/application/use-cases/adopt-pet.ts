import { Injectable } from "@nestjs/common";

import { Either, left, right } from "~/core/either";
import { NotAllowed } from "~/core/errors/not-allowed";
import { PetNotFound } from "~/domain/pet/application/use-cases/errors/pet-not-found";
import { OrganizationNotFound } from "~/domain/organization/application/use-cases/errors/organization-not-found";
import { Adoption } from "~/domain/adoption/enterprise/entities/adoption";
import { PetRepository } from "~/domain/pet/application/repository/pet-repository";
import { OrganizationRepository } from "~/domain/organization/application/repository/organization-repository";
import { AdoptionRepository } from "~/domain/adoption/application/repository/adoption-repository";

import { ExpiresAt } from "../../enterprise/entities/value-object/expires-at";
import { SendVerificationCode } from "../jobs/send-verification-code";

interface AdoptPetInput {
  petId: string;
  organizationId: string;
  adopterEmail: string;
  adopterName: string;
  adopterPhone: string;
}

type AdoptPetOutput = Either<PetNotFound | OrganizationNotFound | NotAllowed, { adoption: Adoption }>;

@Injectable()
export class AdoptPet {
  public constructor(
    private readonly adoptionRepository: AdoptionRepository,
    private readonly organizationRepository: OrganizationRepository,
    private readonly petRepository: PetRepository,
    private readonly sendAdoptionVerificationCodeQueue: SendVerificationCode,
  ) {}

  public async execute(input: AdoptPetInput): Promise<AdoptPetOutput> {
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
