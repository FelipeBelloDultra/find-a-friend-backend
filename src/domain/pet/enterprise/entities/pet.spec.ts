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

    expect(sut.values.adopted).toBeFalsy();

    sut.adopt();

    expect(sut.values.adopted).toBeTruthy();
  });
});
