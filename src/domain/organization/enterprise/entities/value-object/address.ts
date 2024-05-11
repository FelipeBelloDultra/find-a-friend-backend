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

  static getInstanceOrNull(props: AddressProps): Address | null {
    const {
      zipcode,
      state,
      city,
      neighborhood,
      street,
      number,
      latitude,
      longitude,
      complement,
    } = props;

    if (
      [
        zipcode,
        state,
        city,
        neighborhood,
        street,
        number,
        latitude,
        longitude,
        complement,
      ].every((item) => !!item)
    ) {
      return Address.create(props);
    }

    return null;
  }

  static create(props: AddressProps) {
    return new Address(props);
  }
}
