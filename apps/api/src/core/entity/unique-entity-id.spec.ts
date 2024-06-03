import { UniqueEntityID } from "~/core/entity/unique-entity-id";

describe("Unique entity ID", () => {
  it("should create a unique entity", () => {
    const sut = new UniqueEntityID();

    expect(sut.toValue()).toEqual(expect.any(String));
  });

  it("should use a unique entity if provided", () => {
    const oldId = new UniqueEntityID();
    const sut = new UniqueEntityID(oldId.toValue());

    expect(sut.toValue()).toEqual(oldId.toValue());
  });

  it("should compare if two entities has the same value", () => {
    const oldId = new UniqueEntityID();
    const sut = new UniqueEntityID(oldId.toValue());

    expect(sut.equals(oldId)).toBe(true);
  });
});
