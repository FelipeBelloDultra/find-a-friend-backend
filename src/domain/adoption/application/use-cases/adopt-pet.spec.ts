import { AdoptPet } from "./adopt-pet";

import { type Right } from "~/core/either";
import { NotAllowed } from "~/core/errors/not-allowed";
import { PetNotFound } from "~/domain/pet/application/use-cases/errors/pet-not-found";

import { type Organization } from "~/domain/organization/enterprise/entities/organization";
import { type Address } from "~/domain/organization/enterprise/entities/value-object/address";
import { type Pet } from "~/domain/pet/enterprise/entities/pet";
import { type Adoption } from "~/domain/adoption/enterprise/entities/adoption";
import { OrganizationNotFound } from "~/domain/organization/application/use-cases/errors/organization-not-found";

import { InMemoryAdoptionRepository } from "test/repository/in-memory-adoption-repository";
import { InMemoryOrganizationRepository } from "test/repository/in-memory-organization-repository";
import { InMemoryPetRepository } from "test/repository/in-memory-pet-repository";
import { makeOrganizationEntity } from "test/factories/make-organization";
import { makeAddressEntity } from "test/factories/make-address";
import { makePetEntity } from "test/factories/make-pet";
import { makeAdoption } from "test/factories/make-adoption";

let sut: AdoptPet;
let inMemoryPetRepository: InMemoryPetRepository;
let inMemoryOrganizationRepository: InMemoryOrganizationRepository;
let inMemoryAdoptionRepository: InMemoryAdoptionRepository;
let organization: Organization;
let address: Address;
let pet: Pet;

describe("Adopt pet", () => {
  beforeEach(async () => {
    address = makeAddressEntity();
    organization = await makeOrganizationEntity();
    pet = makePetEntity({
      organizationId: organization.id,
    });

    inMemoryOrganizationRepository = new InMemoryOrganizationRepository();
    inMemoryPetRepository = new InMemoryPetRepository(inMemoryOrganizationRepository);
    inMemoryAdoptionRepository = new InMemoryAdoptionRepository();

    sut = new AdoptPet(inMemoryAdoptionRepository, inMemoryOrganizationRepository, inMemoryPetRepository);
  });

  it("should be able to adopt a pet", async () => {
    await inMemoryPetRepository.create(pet);
    organization.address = address;
    await inMemoryOrganizationRepository.create(organization);
    const adoption = makeAdoption();

    const result = (await sut.execute({
      ...adoption,
      organizationId: organization.id.toValue(),
      petId: pet.id.toValue(),
    })) as Right<never, { adoption: Adoption }>;

    expect(result.isRight()).toBeTruthy();
    expect(inMemoryAdoptionRepository.adoptions.length).toBe(1);
    expect(inMemoryAdoptionRepository.adoptions[0].id.equals(result.value.adoption.id)).toBeTruthy();
  });

  it("should not be able to adopt a pet if organization does not exists", async () => {
    await inMemoryPetRepository.create(pet);
    organization.address = address;
    await inMemoryOrganizationRepository.create(organization);
    const adoption = makeAdoption();

    const result = await sut.execute({
      ...adoption,
      organizationId: "non-existent-id",
      petId: pet.id.toValue(),
    });

    expect(result.isLeft()).toBeTruthy();
    expect(result.value).toBeInstanceOf(OrganizationNotFound);
  });

  it("should not be able to adopt a pet if pet does not exists", async () => {
    await inMemoryPetRepository.create(pet);
    organization.address = address;
    await inMemoryOrganizationRepository.create(organization);
    const adoption = makeAdoption();

    const result = await sut.execute({
      ...adoption,
      organizationId: organization.id.toValue(),
      petId: "non-existent-id",
    });

    expect(result.isLeft()).toBeTruthy();
    expect(result.value).toBeInstanceOf(PetNotFound);
  });

  it("should not be able to adopt a pet if pet is from another organization", async () => {
    organization.address = address;
    await inMemoryOrganizationRepository.create(organization);
    const newPet = await inMemoryPetRepository.create(makePetEntity());
    const adoption = makeAdoption();

    const result = await sut.execute({
      ...adoption,
      organizationId: organization.id.toValue(),
      petId: newPet.id.toValue(),
    });

    expect(result.isLeft()).toBeTruthy();
    expect(result.value).toBeInstanceOf(NotAllowed);
  });

  it("should not be able to adopt a pet if organization cannot continue (without address)", async () => {
    await inMemoryOrganizationRepository.create(organization);
    await inMemoryPetRepository.create(pet);
    const adoption = makeAdoption();

    const result = await sut.execute({
      ...adoption,
      organizationId: organization.id.toValue(),
      petId: pet.id.toValue(),
    });

    expect(result.isLeft()).toBeTruthy();
    expect(result.value).toBeInstanceOf(NotAllowed);
  });
});
