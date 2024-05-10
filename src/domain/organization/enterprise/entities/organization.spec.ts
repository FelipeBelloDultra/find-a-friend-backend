import { faker } from "@faker-js/faker";
import { UniqueEntityID } from "~/core/entity/unique-entity-id";
import { Organization } from "./organization";
import { Alias } from "./value-object/alias";

describe("Organization", () => {
  it("should create a new organization", () => {
    const name = faker.company.name();
    const phone = faker.phone.number();

    const sut = Organization.create({
      name,
      logoUrl: faker.image.url(),
      phone,
    });

    expect(sut.id.toValue()).toEqual(expect.any(String));
    expect(sut.alias.value).toBe(Alias.createFromText(name).value);
    expect(sut.phone).toBe(phone);
  });

  it("should restore an old organization", () => {
    const id = new UniqueEntityID();
    const name = faker.company.name();
    const alias = Alias.createFromText(name);

    const sut = Organization.create(
      {
        name,
        alias,
        logoUrl: faker.image.url(),
        phone: faker.phone.number(),
      },
      id
    );

    expect(sut.id.toValue()).toEqual(id.toValue());
    expect(sut.alias.value).toBe(alias.value);
  });
});
