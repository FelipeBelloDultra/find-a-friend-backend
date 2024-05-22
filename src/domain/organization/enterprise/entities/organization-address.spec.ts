import { makeOrganizationAddress } from "test/factories/make-organization-address";

import { OrganizationAddress } from "./organization-address";

describe("OrganizationAddress", () => {
  it("should create an organization address instance", () => {
    const address = makeOrganizationAddress();

    const sut = OrganizationAddress.create(address);

    expect(sut.id.toValue()).toEqual(expect.any(String));
  });
});
