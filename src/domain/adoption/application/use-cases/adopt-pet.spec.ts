import { NotAllowed } from "~/core/errors/not-allowed";
import { PetNotFound } from "~/domain/pet/application/use-cases/errors/pet-not-found";
import { OrganizationNotFound } from "~/domain/organization/application/use-cases/errors/organization-not-found";
import { InMemoryAdoptionRepository } from "test/repository/in-memory-adoption-repository";
import { InMemoryOrganizationRepository } from "test/repository/in-memory-organization-repository";
import { InMemoryPetRepository } from "test/repository/in-memory-pet-repository";
import { makeOrganizationEntity } from "test/factories/make-organization";
import { makePetEntity } from "test/factories/make-pet";
import { makeAdoption } from "test/factories/make-adoption";
import { InMemoryOrganizationAddressRepository } from "test/repository/in-memory-organization-address-repository";
import { makeOrganizationAddressEntity } from "test/factories/make-organization-address";
import { FakeQueueProvider } from "test/queue/fake-queue-provider";
import { OrganizationAddress } from "~/domain/organization/enterprise/entities/organization-address";
import { Adoption } from "~/domain/adoption/enterprise/entities/adoption";
import { Pet } from "~/domain/pet/enterprise/entities/pet";
import { Organization } from "~/domain/organization/enterprise/entities/organization";
import { Right } from "~/core/either";

import { AdoptPet } from "./adopt-pet";

describe("Adopt pet", () => {
  let sut: AdoptPet;
  let inMemoryPetRepository: InMemoryPetRepository;
  let inMemoryOrganizationRepository: InMemoryOrganizationRepository;
  let inMemoryOrganizationAddressRepository: InMemoryOrganizationAddressRepository;
  let inMemoryAdoptionRepository: InMemoryAdoptionRepository;
  let fakeQueueProvider: FakeQueueProvider;
  let organizationAddress: OrganizationAddress;
  let organization: Organization;
  let pet: Pet;

  beforeEach(async () => {
    organization = await makeOrganizationEntity();
    organizationAddress = makeOrganizationAddressEntity({
      organizationId: organization.id,
    });
    pet = makePetEntity({
      organizationId: organization.id,
    });

    fakeQueueProvider = new FakeQueueProvider();
    inMemoryOrganizationAddressRepository = new InMemoryOrganizationAddressRepository();
    inMemoryOrganizationRepository = new InMemoryOrganizationRepository();
    inMemoryPetRepository = new InMemoryPetRepository(inMemoryOrganizationAddressRepository);
    inMemoryAdoptionRepository = new InMemoryAdoptionRepository();

    sut = new AdoptPet(
      inMemoryAdoptionRepository,
      inMemoryOrganizationRepository,
      inMemoryPetRepository,
      fakeQueueProvider,
    );
  });

  it("should be able to adopt a pet", async () => {
    await inMemoryPetRepository.create(pet);
    await inMemoryOrganizationRepository.create(organization);
    await inMemoryOrganizationAddressRepository.create(organizationAddress);
    organization.completeProfile();
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
    await inMemoryOrganizationAddressRepository.create(organizationAddress);
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
    await inMemoryOrganizationAddressRepository.create(organizationAddress);
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
    await inMemoryOrganizationAddressRepository.create(organizationAddress);
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
