import { faker } from "@faker-js/faker";
import { UniqueEntityID } from "~/core/entity/unique-entity-id";
import { Organization } from "./organization";

describe("Organization", () => {
  it("should create a new organization", () => {
    const name = faker.company.name();
    const phone = faker.phone.number();
    const email = faker.internet.email();

    const sut = Organization.create({
      name,
      logoUrl: faker.image.url(),
      phone,
      email,
      password: faker.internet.password(),
    });

    expect(sut.id.toValue()).toEqual(expect.any(String));
    expect(sut.email).toBe(email);
    expect(sut.phone).toBe(phone);
  });

  it("should restore an old organization", () => {
    const id = new UniqueEntityID();

    const sut = Organization.create(
      {
        email: faker.internet.email(),
        password: faker.internet.password(),
        name: faker.company.name(),
        logoUrl: faker.image.url(),
        phone: faker.phone.number(),
      },
      id
    );

    expect(sut.id.equals(id)).toBeTruthy();
  });
});
