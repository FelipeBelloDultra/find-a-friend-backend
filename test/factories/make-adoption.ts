import { faker } from "@faker-js/faker";
import { UniqueEntityID } from "~/core/entity/unique-entity-id";
import {
  Adoption,
  AdoptionProps,
} from "~/domain/adoption/enterprise/entities/adoption";

export function makeAdoption() {
  return {
    petId: new UniqueEntityID(),
    organizationId: new UniqueEntityID(),
    adopterName: faker.person.fullName(),
    adopterPhone: faker.phone.number(),
  };
}

export function makeAdoptionEntity(
  override: Partial<AdoptionProps> = {},
  id?: UniqueEntityID
) {
  const adoption = Adoption.create(
    {
      ...makeAdoption(),
      ...override,
    },
    id
  );

  return adoption;
}
