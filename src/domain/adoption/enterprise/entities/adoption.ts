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
  public get petId() {
    return this.props.petId;
  }

  public get organizationId() {
    return this.props.organizationId;
  }

  public get adopterName() {
    return this.props.adopterName;
  }

  public get adopterEmail() {
    return this.props.adopterEmail;
  }

  public get adopterPhone() {
    return this.props.adopterPhone;
  }

  public get createdAt() {
    return this.props.createdAt;
  }

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
