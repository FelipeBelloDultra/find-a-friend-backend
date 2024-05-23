import { faker } from "@faker-js/faker";

import { Pet } from "~/domain/pet/enterprise/entities/pet";
import { UniqueEntityID } from "~/core/entity/unique-entity-id";
import { AdoptionStatus } from "~/domain/pet/enterprise/entities/value-object/adoption-status";

import type { PetProps } from "~/domain/pet/enterprise/entities/pet";

export function makePet() {
  return {
    organizationId: new UniqueEntityID(),
    organizationAddressId: new UniqueEntityID(),
    name: faker.animal.dog(),
    about: faker.lorem.text(),
    size: "LARGE",
    energyLevel: "HIGH",
    environmentSize: "SMALL",
    adoptionStatus: AdoptionStatus.create(),
  } as const;
}

export function makePetEntity(override: Partial<PetProps> = {}, id?: UniqueEntityID) {
  const pet = Pet.create(
    {
      ...makePet(),
      ...override,
    },
    id,
  );

  return pet;
}
