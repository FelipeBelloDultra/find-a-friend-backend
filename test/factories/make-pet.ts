import { faker } from "@faker-js/faker";
import { Pet, PetProps } from "~/domain/pet/enterprise/entities/pet";
import { UniqueEntityID } from "~/core/entity/unique-entity-id";

export function makePet() {
  return {
    addressId: new UniqueEntityID(),
    organizationId: new UniqueEntityID(),
    name: faker.animal.dog(),
    about: faker.lorem.text(),
    size: "LARGE",
    energyLevel: "HIGH",
    environment: "SMALL",
  } as const;
}

export function makePetEntity(
  override: Partial<PetProps> = {},
  id?: UniqueEntityID
) {
  const pet = Pet.create(
    {
      ...makePet(),
      ...override,
    },
    id
  );

  return pet;
}
