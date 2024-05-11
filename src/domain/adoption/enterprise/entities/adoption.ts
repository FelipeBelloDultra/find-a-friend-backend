import { Entity } from "~/core/entity/entity";
import { UniqueEntityID } from "~/core/entity/unique-entity-id";

export interface AdoptionProps {
  petId: UniqueEntityID;
  organizationId: UniqueEntityID;
  adopterName: string;
  adopterPhone: string;
  createdAt: Date;
}

export class Adoption extends Entity<AdoptionProps> {
  static create(props: AdoptionProps, id?: UniqueEntityID) {
    return new Adoption(props, id);
  }
}
