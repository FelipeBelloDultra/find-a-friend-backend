import { ShowPetDetail } from "./show-pet-detail";

import { PetNotFound } from "~/core/errors/pet-not-found";

import { InMemoryPetRepository } from "test/repository/in-memory-pet-repository";
import { InMemoryOrganizationRepository } from "test/repository/in-memory-organization-repository";
import { makePetEntity } from "test/factories/make-pet";

let sut: ShowPetDetail;
let inMemoryOrganizationRepository: InMemoryOrganizationRepository;
let inMemoryPetRepository: InMemoryPetRepository;

describe("Show pet details", () => {
  beforeEach(() => {
    inMemoryOrganizationRepository = new InMemoryOrganizationRepository();
    inMemoryPetRepository = new InMemoryPetRepository(
      inMemoryOrganizationRepository
    );
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
