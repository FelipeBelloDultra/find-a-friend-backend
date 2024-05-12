import { Entity } from "~/core/entity/entity";

import type { UniqueEntityID } from "~/core/entity/unique-entity-id";
import type { Optional } from "~/core/types/optional";
import type { Password } from "./value-object/password";
import type { Address } from "./value-object/address";

export interface OrganizationProps {
  name: string;
  email: string;
  password: Password;
  logoUrl: string;
  phone: string;
  address: Address | null;
  createdAt: Date;
  updatedAt: Date;
}

export class Organization extends Entity<OrganizationProps> {
  public get logoUrl() {
    return this.props.logoUrl;
  }

  public get updatedAt() {
    return this.props.updatedAt;
  }

  public get createdAt() {
    return this.props.createdAt;
  }

  public get phone() {
    return this.props.phone;
  }

  public get name() {
    return this.props.name;
  }

  public get email() {
    return this.props.email;
  }

  public get password() {
    return this.props.password;
  }

  public get address(): Address | null {
    return this.props.address;
  }

  public set address(address: Address) {
    this.props.address = address;
    this.updated();
  }

  private updated() {
    this.props.updatedAt = new Date();
  }

  public canContinue() {
    return this.address !== null;
  }

  public static create(props: Optional<OrganizationProps, "createdAt" | "address" | "updatedAt">, id?: UniqueEntityID) {
    return new Organization(
      {
        ...props,
        address: props.address ?? null,
        createdAt: props.createdAt ?? new Date(),
        updatedAt: props.updatedAt ?? new Date(),
      },
      id,
    );
  }
}
