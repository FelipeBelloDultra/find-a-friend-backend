import { faker } from "@faker-js/faker";

import { UniqueEntityID } from "~/core/entity/unique-entity-id";
import { makeOrganizationEntity } from "test/factories/make-organization";

import { Organization } from "./organization";
import { Password } from "./value-object/password";

describe("Organization", () => {
  it("should create a new organization", async () => {
    const name = faker.company.name();
    const phone = faker.phone.number();
    const email = faker.internet.email();

    const sut = Organization.create({
      name,
      logoUrl: faker.image.url(),
      phone,
      email,
      password: await Password.create("password"),
      totalAddresses: 0,
    });

    expect(sut.id.toValue()).toEqual(expect.any(String));
    expect(sut.values.email).toBe(email);
    expect(sut.values.phone).toBe(phone);
  });

  it("should not be able to continue if has no address registered", async () => {
    const sut = await makeOrganizationEntity();

    expect(sut.canContinue()).toBeFalsy();
  });

  it("should restore an old organization", async () => {
    const id = new UniqueEntityID();

    const sut = Organization.create(
      {
        email: faker.internet.email(),
        password: await Password.create("password"),
        name: faker.company.name(),
        logoUrl: faker.image.url(),
        phone: faker.phone.number(),
      },
      id,
    );

    expect(sut.id.equals(id)).toBeTruthy();
  });

  it("should be able to add address to organization", async () => {
    const sut = await makeOrganizationEntity();

    expect(sut.canContinue()).toBeFalsy();

    sut.increaseAddressCounter();

    expect(sut.canContinue()).toBeTruthy();
  });
});
