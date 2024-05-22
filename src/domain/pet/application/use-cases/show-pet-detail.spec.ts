import { InMemoryPetRepository } from "test/repository/in-memory-pet-repository";
import { makePetEntity } from "test/factories/make-pet";
import { InMemoryOrganizationAddressRepository } from "test/repository/in-memory-organization-address-repository";

import { PetNotFound } from "./errors/pet-not-found";
import { ShowPetDetail } from "./show-pet-detail";

let sut: ShowPetDetail;
let inMemoryOrganizationAddressRepository: InMemoryOrganizationAddressRepository;
let inMemoryPetRepository: InMemoryPetRepository;

describe("Show pet details", () => {
  beforeEach(() => {
    inMemoryOrganizationAddressRepository = new InMemoryOrganizationAddressRepository();
    inMemoryPetRepository = new InMemoryPetRepository(inMemoryOrganizationAddressRepository);
    sut = new ShowPetDetail(inMemoryPetRepository);
  });

  it("should show pet details", async () => {
    const pet = makePetEntity();
    await inMemoryPetRepository.create(pet);

    const result = await sut.execute({
      petId: pet.id.toValue(),
    });

    expect(result.isRight()).toBeTruthy();
    expect(inMemoryPetRepository.pets[0].id.equals(pet.id)).toBeTruthy();
  });

  it("should not show pet detail if it is not found", async () => {
    const pet = makePetEntity();

    const result = await sut.execute({
      petId: pet.id.toValue(),
    });

    expect(result.isLeft()).toBeTruthy();
    expect(result.value).toBeInstanceOf(PetNotFound);
  });
});
