import { makePet } from "test/factories/make-pet";
import { UniqueEntityID } from "~/core/entity/unique-entity-id";

import { Pet } from "./pet";

describe("Pet", () => {
  it("should create a new pet instance", () => {
    const pet = makePet();
    const sut = Pet.create(pet);

    expect(sut.id.toValue()).toEqual(expect.any(String));
    expect(sut).toBeInstanceOf(Pet);
    expect(sut.id).toBeInstanceOf(UniqueEntityID);
  });

  it("should be able to adopt pet", () => {
    const pet = makePet();

    const sut = Pet.create(pet);

    sut.intentionToAdopt();
    expect(sut.values.adoptionStatus.value).toBe("PENDING");

    sut.cancelAdoption();
    expect(sut.values.adoptionStatus.value).toBe("NOT_ADOPTED");

    sut.completeAdoption();
    expect(sut.values.adoptionStatus.value).toBe("ADOPTED");
  });
});
