import { makeOrganizationAddress } from "test/factories/make-organization-address";

import { OrganizationAddress } from "./organization-address";

describe("OrganizationAddress", () => {
  it("should create an organization address instance", () => {
    const address = makeOrganizationAddress();

    const sut = OrganizationAddress.create(address);

    expect(sut.id.toValue()).toEqual(expect.any(String));
    expect(sut.city).toEqual(address.city);
    expect(sut.state).toEqual(address.state);
    expect(sut.neighborhood).toEqual(address.neighborhood);
    expect(sut.street).toEqual(address.street);
    expect(sut.number).toEqual(address.number);
    expect(sut.complement).toEqual(address.complement);
    expect(sut.latitude).toEqual(address.latitude);
    expect(sut.longitude).toEqual(address.longitude);
    expect(sut.organizationId).toEqual(address.organizationId);
    expect(sut.zipcode).toEqual(address.zipcode);
    expect(sut.updatedAt).toBeDefined();
    expect(sut.createdAt).toBeDefined();
  });
});
