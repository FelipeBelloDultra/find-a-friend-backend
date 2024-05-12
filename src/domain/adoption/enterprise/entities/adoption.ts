import { Entity } from "~/core/entity/entity";
import { UniqueEntityID } from "~/core/entity/unique-entity-id";
import { Optional } from "~/core/types/optional";

export interface AdoptionProps {
  petId: UniqueEntityID;
  organizationId: UniqueEntityID;
  adopterName: string;
  adopterPhone: string;
  createdAt: Date;
}

export class Adoption extends Entity<AdoptionProps> {
  public get organizationId() {
    return this.props.organizationId;
  }

  static create(props: Optional<AdoptionProps, "createdAt">, id?: UniqueEntityID) {
    return new Adoption(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
      },
      id,
    );
  }
}
