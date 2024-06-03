import { makeAdoption } from "test/factories/make-adoption";

import { Adoption } from "./adoption";

describe("Adoption", () => {
  it("should create an adoption instance", () => {
    const adoption = makeAdoption();

    const sut = Adoption.create(adoption);

    expect(sut.id.toValue()).toEqual(expect.any(String));
    expect(sut.values.adopterEmail).toEqual(adoption.adopterEmail);
  });

  it("should be able confirm an adoption", () => {
    const adoption = makeAdoption();

    const sut = Adoption.create(adoption);

    expect(sut.values.confirmedAt).toBeNull();

    sut.confirmAdoption();

    expect(sut.values.confirmedAt).toEqual(expect.any(Date));
  });

  it("should verify if one adoption was done", () => {
    const adoption = makeAdoption();

    const sut = Adoption.create(adoption);

    expect(sut.wasConfirmed()).toBeFalsy();

    sut.confirmAdoption();

    expect(sut.wasConfirmed()).toBeTruthy();
  });
});
