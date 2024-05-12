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
    expect(sut.adopted).toBeFalsy();
    expect(sut.energyLevel).toBeDefined();
    expect(sut.size).toBeDefined();
    expect(sut.environment).toBeDefined();
  });

  it("should be able to adopt pet", () => {
    const pet = makePet();
    const sut = Pet.create(pet);

    expect(sut.adopted).toBeFalsy();

    sut.adopt();

    expect(sut.adopted).toBeTruthy();
  });
});
