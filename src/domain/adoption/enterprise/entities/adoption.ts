import { Entity } from "~/core/entity/entity";

import type { UniqueEntityID } from "~/core/entity/unique-entity-id";
import type { Optional } from "~/core/types/optional";

export interface AdoptionProps {
  petId: UniqueEntityID;
  organizationId: UniqueEntityID;
  adopterName: string;
  adopterEmail: string;
  adopterPhone: string;
  createdAt: Date;
}

export class Adoption extends Entity<AdoptionProps> {
  public static create(props: Optional<AdoptionProps, "createdAt">, id?: UniqueEntityID) {
    return new Adoption(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
      },
      id,
    );
  }
}
