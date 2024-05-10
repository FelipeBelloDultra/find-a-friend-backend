import { Entity } from "~/core/entity/entity";
import { UniqueEntityID } from "~/core/entity/unique-entity-id";

export interface AddressProps {
  organizationId: UniqueEntityID;
  street: string;
  city: string;
  zipcode: string;
  country: string;
  neighborhood: string;
  number: string;
  complement: string | null;
}

export class Address extends Entity {
  static create(props: AddressProps, id?: UniqueEntityID) {
    return new Address(props, id);
  }
}
