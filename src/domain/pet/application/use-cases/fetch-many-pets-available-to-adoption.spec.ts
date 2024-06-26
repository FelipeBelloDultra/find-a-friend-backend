import { makeOrganizationEntity } from "test/factories/make-organization";
import { makePetEntity } from "test/factories/make-pet";
import { InMemoryOrganizationRepository } from "test/repository/in-memory-organization-repository";
import { InMemoryPetRepository } from "test/repository/in-memory-pet-repository";
import { InMemoryOrganizationAddressRepository } from "test/repository/in-memory-organization-address-repository";
import { makeOrganizationAddressEntity } from "test/factories/make-organization-address";
import { Pet } from "~/domain/pet/enterprise/entities/pet";
import { OrganizationAddress } from "~/domain/organization/enterprise/entities/organization-address";
import { Organization } from "~/domain/organization/enterprise/entities/organization";

import { FetchManyPetsAvailableToAdoption } from "./fetch-many-pets-available-to-adoption";

describe("Fetch many pets available to adoption", () => {
  let sut: FetchManyPetsAvailableToAdoption;
  let inMemoryPetRepository: InMemoryPetRepository;
  let inMemoryOrganizationRepository: InMemoryOrganizationRepository;
  let inMemoryOrganizationAddressRepository: InMemoryOrganizationAddressRepository;
  let organization: Organization;
  let organizationAddress: OrganizationAddress;
  let pet: Pet;

  beforeEach(async () => {
    organizationAddress = makeOrganizationAddressEntity();
    organization = await makeOrganizationEntity();
    pet = makePetEntity({
      organizationId: organization.id,
      organizationAddressId: organizationAddress.id,
    });

    inMemoryOrganizationAddressRepository = new InMemoryOrganizationAddressRepository();
    inMemoryOrganizationRepository = new InMemoryOrganizationRepository();
    inMemoryPetRepository = new InMemoryPetRepository(inMemoryOrganizationAddressRepository);

    await inMemoryOrganizationRepository.create(organization);

    for (let i = 0; i < 25; i++) {
      await inMemoryPetRepository.create(pet);
    }

    sut = new FetchManyPetsAvailableToAdoption(inMemoryPetRepository);
  });

  it("should fetch all pets by city in the first page", async () => {
    await inMemoryOrganizationAddressRepository.create(organizationAddress);

    const result = await sut.execute({
      city: organizationAddress.values.city,
      state: organizationAddress.values.state,
      page: 1,
      limit: 20,
    });

    expect(result.isRight()).toBeTruthy();
    expect(inMemoryPetRepository.pets.length).toBe(25);
    expect(result.value.pets.length).toBe(20);
    expect(result.value.total).toBe(25);
  });

  it("should fetch all pets by city in the second page", async () => {
    await inMemoryOrganizationAddressRepository.create(organizationAddress);

    const result = await sut.execute({
      city: organizationAddress.values.city,
      state: organizationAddress.values.state,
      page: 2,
      limit: 20,
    });

    expect(result.isRight()).toBeTruthy();
    expect(inMemoryPetRepository.pets.length).toBe(25);
    expect(result.value.pets.length).toBe(5);
  });

  it("should return an empty array if does not find some city", async () => {
    const result = await sut.execute({
      city: organizationAddress.values.city,
      state: organizationAddress.values.state,
      page: 1,
      limit: 20,
    });

    expect(result.isRight()).toBeTruthy();
    expect(inMemoryPetRepository.pets.length).toBe(25);
    expect(result.value.pets.length).toBe(0);
    expect(result.value.total).toBe(0);
  });
});
