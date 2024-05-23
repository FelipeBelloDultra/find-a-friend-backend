import { makeAdoption } from "test/factories/make-adoption";

import { Adoption } from "./adoption";

describe("Adoption", () => {
  beforeAll(() => {
    vi.useFakeTimers();
  });

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

  it("should create an adoption instance with expiration time in the future (10 min)", () => {
    vi.useFakeTimers();

    const date = new Date("2000-01-01T08:00:00");
    vi.setSystemTime(date);
    const adoption = makeAdoption();

    const sut = Adoption.create(adoption);
    date.setMinutes(date.getMinutes() + 15);

    expect(sut.values.expiresAt).toEqual(date);
  });

  afterAll(() => {
    vi.clearAllTimers();
  });
});
