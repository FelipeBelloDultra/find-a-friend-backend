import { CreatePet } from "./create-pet";

import { OrganizationNotFound } from "~/domain/organization/application/use-cases/errors/organization-not-found";
import { NotAllowed } from "~/core/errors/not-allowed";

import { InMemoryOrganizationRepository } from "test/repository/in-memory-organization-repository";
import { InMemoryPetRepository } from "test/repository/in-memory-pet-repository";
import { makeOrganizationEntity } from "test/factories/make-organization";
import { makeAddressEntity } from "test/factories/make-address";
import { makePet } from "test/factories/make-pet";

let sut: CreatePet;
let inMemoryOrganizationRepository: InMemoryOrganizationRepository;
let inMemoryPetRepository: InMemoryPetRepository;

describe("Create pet", () => {
  beforeEach(() => {
    inMemoryOrganizationRepository = new InMemoryOrganizationRepository();
    inMemoryPetRepository = new InMemoryPetRepository(inMemoryOrganizationRepository);
    sut = new CreatePet(inMemoryOrganizationRepository, inMemoryPetRepository);
  });

  it("should be able to create a pet with one organization", async () => {
    const org = await makeOrganizationEntity();
    const pet = makePet();
    const address = makeAddressEntity();
    org.address = address;
    await inMemoryOrganizationRepository.create(org);

    const result = await sut.execute({
      ...pet,
      organizationId: org.id.toValue(),
    });

    expect(result.isRight()).toBeTruthy();
    expect(inMemoryPetRepository.pets[0].organizationId.equals(org.id)).toBeTruthy();
  });

  it("should not be able to create a pet with one organization if organization does not exists", async () => {
    const pet = makePet();

    const result = await sut.execute({
      ...pet,
      organizationId: "invalid-id",
    });

    expect(result.isLeft()).toBeTruthy();
    expect(result.value).toBeInstanceOf(OrganizationNotFound);
  });

  it("should not be able to create a pet if organization does not have address", async () => {
    const org = await makeOrganizationEntity();
    const pet = makePet();
    await inMemoryOrganizationRepository.create(org);

    const result = await sut.execute({
      ...pet,
      organizationId: org.id.toValue(),
    });

    expect(result.isLeft()).toBeTruthy();
    expect(result.value).toBeInstanceOf(NotAllowed);
  });
});
