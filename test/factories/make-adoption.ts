import { faker } from "@faker-js/faker";

import { UniqueEntityID } from "~/core/entity/unique-entity-id";
import { Adoption } from "~/domain/adoption/enterprise/entities/adoption";
import { ExpiresAt } from "~/domain/adoption/enterprise/entities/value-object/expires-at";

import type { AdoptionProps } from "~/domain/adoption/enterprise/entities/adoption";

export function makeAdoption() {
  return {
    petId: new UniqueEntityID(),
    organizationId: new UniqueEntityID(),
    adopterEmail: faker.internet.email(),
    adopterName: faker.person.fullName(),
    adopterPhone: faker.phone.number(),
    expiresAt: ExpiresAt.create(),
  };
}

export function makeAdoptionEntity(override: Partial<AdoptionProps> = {}, id?: UniqueEntityID) {
  const adoption = Adoption.create(
    {
      ...makeAdoption(),
      ...override,
    },
    id,
  );

  return adoption;
}
