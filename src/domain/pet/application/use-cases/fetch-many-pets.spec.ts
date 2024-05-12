import { FetchManyPets } from "./fetch-many-pets";

import { Organization } from "~/domain/organization/enterprise/entities/organization";
import { Address } from "~/domain/organization/enterprise/entities/value-object/address";
import { Pet } from "~/domain/pet/enterprise/entities/pet";

import { makeAddressEntity } from "test/factories/make-address";
import { makeOrganizationEntity } from "test/factories/make-organization";
import { makePetEntity } from "test/factories/make-pet";
import { InMemoryOrganizationRepository } from "test/repository/in-memory-organization-repository";
import { InMemoryPetRepository } from "test/repository/in-memory-pet-repository";

let sut: FetchManyPets;
let inMemoryPetRepository: InMemoryPetRepository;
let inMemoryOrganizationRepository: InMemoryOrganizationRepository;
let organization: Organization;
let address: Address;
let pet: Pet;

describe("Fetch many pets", () => {
  beforeEach(async () => {
    address = makeAddressEntity();
    organization = await makeOrganizationEntity();
    pet = makePetEntity({
      organizationId: organization.id,
    });

    inMemoryOrganizationRepository = new InMemoryOrganizationRepository();
    inMemoryPetRepository = new InMemoryPetRepository(inMemoryOrganizationRepository);

    await inMemoryOrganizationRepository.create(organization);

    for (let i = 0; i < 25; i++) {
      await inMemoryPetRepository.create(pet);
    }

    sut = new FetchManyPets(inMemoryPetRepository);
  });

  it("should fetch all pets by city in the first page", async () => {
    organization.address = address;

    const result = await sut.execute({
      city: address.value.city,
      page: 1,
      limit: 20,
    });

    expect(result.isRight()).toBeTruthy();
    expect(inMemoryPetRepository.pets.length).toBe(25);
    expect(result.value.pets.length).toBe(20);
  });

  it("should fetch all pets by city in the second page", async () => {
    organization.address = address;

    const result = await sut.execute({
      city: address.value.city,
      page: 2,
      limit: 20,
    });

    expect(result.isRight()).toBeTruthy();
    expect(inMemoryPetRepository.pets.length).toBe(25);
    expect(result.value.pets.length).toBe(5);
  });

  it("should return an empty array if does not find some city", async () => {
    const result = await sut.execute({
      city: address.value.city,
      page: 1,
      limit: 20,
    });

    expect(result.isRight()).toBeTruthy();
    expect(inMemoryPetRepository.pets.length).toBe(25);
    expect(result.value.pets.length).toBe(0);
  });
});
