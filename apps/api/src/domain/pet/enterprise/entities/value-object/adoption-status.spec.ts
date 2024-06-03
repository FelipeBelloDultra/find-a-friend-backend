import { AdoptionStatus } from "./adoption-status";

describe("AdoptionStatus", () => {
  it("should create a new AdoptionStatus instance with default value", () => {
    const sut = AdoptionStatus.create();

    expect(sut.value).toBe("NOT_ADOPTED");
  });

  it("should create a new AdoptionStatus with old value", () => {
    const sut = AdoptionStatus.create("ADOPTED");

    expect(sut.value).toBe("ADOPTED");
  });

  it("should change the AdoptionStatus status", () => {
    const sut = AdoptionStatus.create();
    sut.setAdopted();
    expect(sut.value).toBe("ADOPTED");

    sut.setNotAdopted();
    expect(sut.value).toBe("NOT_ADOPTED");

    sut.setPending();
    expect(sut.value).toBe("PENDING");
  });
});
