import { OrganizationNotFound } from "~/domain/organization/application/use-cases/errors/organization-not-found";
import { NotAllowed } from "~/core/errors/not-allowed";
import { InMemoryOrganizationRepository } from "test/repository/in-memory-organization-repository";
import { InMemoryPetRepository } from "test/repository/in-memory-pet-repository";
import { makeOrganizationEntity } from "test/factories/make-organization";
import { makePet } from "test/factories/make-pet";
import { InMemoryOrganizationAddressRepository } from "test/repository/in-memory-organization-address-repository";
import { makeOrganizationAddressEntity } from "test/factories/make-organization-address";
import { OrganizationAddressNotFound } from "~/domain/organization/application/use-cases/errors/organization-address-not-found";

import { CreatePet } from "./create-pet";

let sut: CreatePet;
let inMemoryOrganizationRepository: InMemoryOrganizationRepository;
let inMemoryPetRepository: InMemoryPetRepository;
let inMemoryOrganizationAddressRepository: InMemoryOrganizationAddressRepository;

describe("Create pet", () => {
  beforeEach(() => {
    inMemoryOrganizationAddressRepository = new InMemoryOrganizationAddressRepository();
    inMemoryOrganizationRepository = new InMemoryOrganizationRepository(inMemoryOrganizationAddressRepository);
    inMemoryPetRepository = new InMemoryPetRepository(inMemoryOrganizationAddressRepository);
    sut = new CreatePet(inMemoryOrganizationRepository, inMemoryOrganizationAddressRepository, inMemoryPetRepository);
  });

  it("should be able to create a pet with one organization", async () => {
    const org = await makeOrganizationEntity();
    const pet = makePet();
    const organizationAddress = makeOrganizationAddressEntity({
      organizationId: org.id,
    });
    await inMemoryOrganizationAddressRepository.create(organizationAddress);
    await inMemoryOrganizationRepository.create(org);

    const result = await sut.execute({
      ...pet,
      organizationId: org.id.toValue(),
      organizationAddressId: organizationAddress.id.toValue(),
    });

    expect(result.isRight()).toBeTruthy();
    expect(inMemoryPetRepository.pets[0].values.organizationId.equals(org.id)).toBeTruthy();
  });

  it("should not be able to create a pet with one organization if organization does not exists", async () => {
    const pet = makePet();

    const result = await sut.execute({
      ...pet,
      organizationId: "invalid-id",
      organizationAddressId: "invalid-id",
    });

    expect(result.isLeft()).toBeTruthy();
    expect(result.value).toBeInstanceOf(OrganizationNotFound);
  });

  it("should not be able to create a pet with one organization address if organization address does not exists", async () => {
    const pet = makePet();
    const org = await makeOrganizationEntity();
    await inMemoryOrganizationRepository.create(org);

    const result = await sut.execute({
      ...pet,
      organizationId: org.id.toValue(),
      organizationAddressId: "invalid-id",
    });

    expect(result.isLeft()).toBeTruthy();
    expect(result.value).toBeInstanceOf(OrganizationAddressNotFound);
  });

  it("should not be able to create a pet if organization does not have address", async () => {
    const org = await makeOrganizationEntity();
    const pet = makePet();
    const organizationAddress = makeOrganizationAddressEntity();
    await inMemoryOrganizationAddressRepository.create(organizationAddress);
    await inMemoryOrganizationRepository.create(org);

    const result = await sut.execute({
      ...pet,
      organizationId: org.id.toValue(),
      organizationAddressId: organizationAddress.id.toValue(),
    });

    expect(result.isLeft()).toBeTruthy();
    expect(result.value).toBeInstanceOf(NotAllowed);
  });

  it("should not be able to create a pet if organization has address but organization address id is different", async () => {
    const org = await makeOrganizationEntity();
    const pet = makePet();
    const validOrganizationAddress = makeOrganizationAddressEntity({
      organizationId: org.id,
    });
    await inMemoryOrganizationAddressRepository.create(validOrganizationAddress);
    await inMemoryOrganizationRepository.create(org);
    const invalidOrganizationAddress = await inMemoryOrganizationAddressRepository.create(
      makeOrganizationAddressEntity(),
    );

    const result = await sut.execute({
      ...pet,
      organizationId: org.id.toValue(),
      organizationAddressId: invalidOrganizationAddress.id.toValue(),
    });

    expect(result.isLeft()).toBeTruthy();
    expect(result.value).toBeInstanceOf(NotAllowed);
  });
});
