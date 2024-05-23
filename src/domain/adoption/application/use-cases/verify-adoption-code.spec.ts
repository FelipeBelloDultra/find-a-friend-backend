import { InMemoryAdoptionRepository } from "test/repository/in-memory-adoption-repository";
import { InMemoryPetRepository } from "test/repository/in-memory-pet-repository";
import { InMemoryOrganizationAddressRepository } from "test/repository/in-memory-organization-address-repository";
import { makePetEntity } from "test/factories/make-pet";
import { makeAdoptionEntity } from "test/factories/make-adoption";
import { PetNotFound } from "~/domain/pet/application/use-cases/errors/pet-not-found";

import { VerifyAdoptionCode } from "./verify-adoption-code";
import { AdoptionNotFound } from "./errors/adoption-not-found";
import { AdoptionCodeExpired } from "./errors/adoption-code-expired";

let inMemoryOrganizationAddressRepository: InMemoryOrganizationAddressRepository;
let inMemoryPetRepository: InMemoryPetRepository;
let inMemoryAdoptionRepository: InMemoryAdoptionRepository;
let sut: VerifyAdoptionCode;

describe("Verify adoption code", () => {
  beforeEach(() => {
    inMemoryOrganizationAddressRepository = new InMemoryOrganizationAddressRepository();
    inMemoryAdoptionRepository = new InMemoryAdoptionRepository();
    inMemoryPetRepository = new InMemoryPetRepository(inMemoryOrganizationAddressRepository);

    sut = new VerifyAdoptionCode(inMemoryPetRepository, inMemoryAdoptionRepository);
  });

  it("should verify the adoption code", async () => {
    const pet = makePetEntity();
    const adoption = makeAdoptionEntity({
      petId: pet.id,
    });
    pet.intentionToAdopt();
    await inMemoryPetRepository.create(pet);
    await inMemoryAdoptionRepository.create(adoption);

    const result = await sut.execute({
      adoptionCode: adoption.values.adoptionCode.toValue(),
    });

    expect(result.isRight()).toBeTruthy();
    expect(inMemoryAdoptionRepository.adoptions[0].wasConfirmed()).toBeTruthy();
  });

  it("should not verify the adoption code if does not exists adoption with this code", async () => {
    const result = await sut.execute({
      adoptionCode: "invalid-code",
    });

    expect(result.isLeft()).toBeTruthy();
    expect(result.value).toBeInstanceOf(AdoptionNotFound);
  });

  it("should not verify the adoption code if does not exists pet", async () => {
    const adoption = makeAdoptionEntity();
    await inMemoryAdoptionRepository.create(adoption);

    const result = await sut.execute({
      adoptionCode: adoption.values.adoptionCode.toValue(),
    });

    expect(result.isLeft()).toBeTruthy();
    expect(result.value).toBeInstanceOf(PetNotFound);
  });

  it("should not verify the adoption code if was expired", async () => {
    vi.spyOn(Date, "now").mockImplementation(() => {
      const date = new Date();
      date.setMinutes(date.getMinutes() + 40);

      return date.getTime();
    });

    const pet = makePetEntity();
    const adoption = makeAdoptionEntity({
      petId: pet.id,
    });
    pet.intentionToAdopt();
    await inMemoryPetRepository.create(pet);
    await inMemoryAdoptionRepository.create(adoption);

    const result = await sut.execute({
      adoptionCode: adoption.values.adoptionCode.toValue(),
    });

    expect(result.isLeft()).toBeTruthy();
    expect(result.value).toBeInstanceOf(AdoptionCodeExpired);
  });

  it("should not verify the adoption code if this adoption already confirmed", async () => {
    const pet = makePetEntity();
    const adoption = makeAdoptionEntity({
      petId: pet.id,
    });
    pet.completeAdoption();
    adoption.confirmAdoption();
    await inMemoryPetRepository.create(pet);
    await inMemoryAdoptionRepository.create(adoption);

    const result = await sut.execute({
      adoptionCode: adoption.values.adoptionCode.toValue(),
    });

    expect(result.isLeft()).toBeTruthy();
    expect(result.value).toBeInstanceOf(AdoptionCodeExpired);
  });

  it("should set pet status to NOT_ADOPTED if adoption already confirmed or was expired", async () => {
    const pet = makePetEntity();
    const adoption = makeAdoptionEntity({
      petId: pet.id,
    });
    pet.completeAdoption();
    adoption.confirmAdoption();
    await inMemoryPetRepository.create(pet);
    await inMemoryAdoptionRepository.create(adoption);

    await sut.execute({
      adoptionCode: adoption.values.adoptionCode.toValue(),
    });

    expect(inMemoryPetRepository.pets[0].values.adoptionStatus.value).toBe("NOT_ADOPTED");
  });

  afterAll(() => {
    vi.clearAllMocks();
  });
});
