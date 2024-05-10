export interface AddressProps {
  zipcode: string;
  state: string;
  city: string;
  neighborhood: string;
  street: string;
  number: string;
  latitude: number;
  longitude: number;
  complement: string | null;
}

export class Address {
  public readonly value: AddressProps;

  private constructor(value: AddressProps) {
    this.value = value;
  }

  static create(props: AddressProps) {
    return new Address(props);
  }
}
