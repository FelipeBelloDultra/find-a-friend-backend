import { makeAdoption } from "test/factories/make-adoption";

import { Adoption } from "./adoption";

describe("Adoption", () => {
  it("should create an adoption instance", () => {
    const adoption = makeAdoption();

    const sut = Adoption.create(adoption);

    expect(sut.id.toValue()).toEqual(expect.any(String));
    expect(sut.values.adopterEmail).toEqual(adoption.adopterEmail);
  });
});
