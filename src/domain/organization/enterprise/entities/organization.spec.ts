import { faker } from "@faker-js/faker";
import { UniqueEntityID } from "~/core/entity/unique-entity-id";
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
    });

    expect(sut.id.toValue()).toEqual(expect.any(String));
    expect(sut.email).toBe(email);
    expect(sut.phone).toBe(phone);
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
});
