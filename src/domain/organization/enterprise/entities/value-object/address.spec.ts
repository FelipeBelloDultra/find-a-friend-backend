import { makeAddress } from "test/factories/make-address";

import { Address } from "./address";

describe("Address", () => {
  it("should create an address instance", () => {
    const address = makeAddress();

    const sut = Address.create(address);

    expect(sut.value).toMatchObject(address);
  });

  it("should create a new address instance with getInstanceOrNull method", () => {
    const address = makeAddress();

    const sut = Address.getInstanceOrNull(address);

    expect(sut).toBeInstanceOf(Address);
  });

  it("should return null if some address props are not set with getInstanceOrNull method", () => {
    const address = makeAddress();

    const sut = Address.getInstanceOrNull({ ...address, city: "" });

    expect(sut).toBeNull();
  });
});
