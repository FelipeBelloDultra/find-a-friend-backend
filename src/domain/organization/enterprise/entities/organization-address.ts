import { Entity } from "~/core/entity/entity";

import type { UniqueEntityID } from "~/core/entity/unique-entity-id";
import type { Optional } from "~/core/types/optional";

export interface OrganizationAddressProps {
  organizationId: UniqueEntityID;
  zipcode: string;
  state: string;
  city: string;
  neighborhood: string;
  street: string;
  number: string;
  latitude: number;
  longitude: number;
  complement: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export class OrganizationAddress extends Entity<OrganizationAddressProps> {
  public get zipcode(): string {
    return this.props.zipcode;
  }

  public get state(): string {
    return this.props.state;
  }

  public get city(): string {
    return this.props.city;
  }

  public get neighborhood(): string {
    return this.props.neighborhood;
  }

  public get street(): string {
    return this.props.street;
  }

  public get number(): string {
    return this.props.number;
  }

  public get complement(): string | null {
    return this.props.complement;
  }

  public get latitude(): number {
    return this.props.latitude;
  }

  public get longitude(): number {
    return this.props.longitude;
  }

  public get organizationId(): UniqueEntityID {
    return this.props.organizationId;
  }

  public get updatedAt() {
    return this.props.updatedAt;
  }

  public get createdAt() {
    return this.props.createdAt;
  }

  public static create(props: Optional<OrganizationAddressProps, "createdAt" | "updatedAt">, id?: UniqueEntityID) {
    return new OrganizationAddress(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
        updatedAt: props.updatedAt ?? new Date(),
      },
      id,
    );
  }
}
