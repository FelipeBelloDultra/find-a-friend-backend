import { makeAddressEntity } from "test/factories/make-address";
import { FetchManyPets } from "./fetch-many-pets";

import { InMemoryOrganizationRepository } from "test/repository/in-memory-organization-repository";
import { InMemoryPetRepository } from "test/repository/in-memory-pet-repository";
import { makeOrganizationEntity } from "test/factories/make-organization";
import { makePetEntity } from "test/factories/make-pet";

let sut: FetchManyPets;
let inMemoryPetRepository: InMemoryPetRepository;
let inMemoryOrganizationRepository: InMemoryOrganizationRepository;

describe("Fetch many pets", () => {
  beforeEach(() => {
    inMemoryOrganizationRepository = new InMemoryOrganizationRepository();
    inMemoryPetRepository = new InMemoryPetRepository(
      inMemoryOrganizationRepository
    );
    sut = new FetchManyPets(inMemoryPetRepository);
  });

  it("should fetch all pets by city in the first page", async () => {
    const PAGE = 1;
    const organization = await makeOrganizationEntity();
    const address = makeAddressEntity();
    const pet = makePetEntity({
      organizationId: organization.id,
    });
    organization.address = address;
    await inMemoryOrganizationRepository.create(organization);

    for (let i = 0; i < 25; i++) {
      await inMemoryPetRepository.create(pet);
    }

    const result = await sut.execute({
      city: address.value.city,
      page: PAGE,
    });

    if (result.isLeft()) throw new Error();

    expect(result.isRight()).toBeTruthy();
    expect(inMemoryPetRepository.pets.length).toBe(25);
    expect(result.value.pets.length).toBe(20);
  });

  it("should fetch all pets by city in the second page", async () => {
    const PAGE = 2;
    const organization = await makeOrganizationEntity();
    const address = makeAddressEntity();
    const pet = makePetEntity({
      organizationId: organization.id,
    });
    organization.address = address;
    await inMemoryOrganizationRepository.create(organization);

    for (let i = 0; i < 25; i++) {
      await inMemoryPetRepository.create(pet);
    }

    const result = await sut.execute({
      city: address.value.city,
      page: PAGE,
    });

    if (result.isLeft()) throw new Error();

    expect(result.isRight()).toBeTruthy();
    expect(inMemoryPetRepository.pets.length).toBe(25);
    expect(result.value.pets.length).toBe(5);
  });

  it("should return an empty array if does not find some city", async () => {
    const PAGE = 1;
    const organization = await makeOrganizationEntity();
    const address = makeAddressEntity();
    const pet = makePetEntity({
      organizationId: organization.id,
    });
    await inMemoryOrganizationRepository.create(organization);

    for (let i = 0; i < 25; i++) {
      await inMemoryPetRepository.create(pet);
    }

    const result = await sut.execute({
      city: address.value.city,
      page: PAGE,
    });

    if (result.isLeft()) throw new Error();

    expect(result.isRight()).toBeTruthy();
    expect(inMemoryPetRepository.pets.length).toBe(25);
    expect(result.value.pets.length).toBe(0);
  });
});
