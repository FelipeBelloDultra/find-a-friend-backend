import { faker } from "@faker-js/faker";
import { UniqueEntityID } from "~/core/entity/unique-entity-id";
import { Organization } from "./organization";
import { Password } from "./value-object/password";
import { Address } from "./value-object/address";
import { makeAddress } from "test/factories/make-address";

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
    });

    expect(sut.id.toValue()).toEqual(expect.any(String));
    expect(sut.email).toBe(email);
    expect(sut.phone).toBe(phone);
    expect(sut.address).toBeNull();
    expect(sut.updatedAt).toBeDefined();
    expect(sut.logoUrl).toBeDefined();
    expect(sut.createdAt).toBeDefined();
  });

  it("should not be able to continue if address is empty", async () => {
    const name = faker.company.name();
    const phone = faker.phone.number();
    const email = faker.internet.email();

    const sut = Organization.create({
      name,
      logoUrl: faker.image.url(),
      phone,
      email,
      password: await Password.create("password"),
    });

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
      id
    );

    expect(sut.id.equals(id)).toBeTruthy();
  });

  it("should be able to add address to organization", async () => {
    const id = new UniqueEntityID();

    const sut = Organization.create(
      {
        email: faker.internet.email(),
        password: await Password.create("password"),
        name: faker.company.name(),
        logoUrl: faker.image.url(),
        phone: faker.phone.number(),
      },
      id
    );

    expect(sut.id.equals(id)).toBeTruthy();

    sut.address = Address.create(makeAddress());

    expect(sut.address).not.toBeNull();
    expect(sut.canContinue()).toBeTruthy();
  });
});
