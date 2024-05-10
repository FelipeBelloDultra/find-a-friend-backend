import { Entity } from "~/core/entity/entity";
import { UniqueEntityID } from "~/core/entity/unique-entity-id";

export interface AddressProps {
  zipcode: string;
  state: string;
  city: string;
  neighborhood: string;
  street: string;
  number: string;
  latitude: string;
  longitude: string;
  complement: string | null;
}

export class Address extends Entity {
  static create(props: AddressProps, id?: UniqueEntityID) {
    return new Address(props, id);
  }
}
