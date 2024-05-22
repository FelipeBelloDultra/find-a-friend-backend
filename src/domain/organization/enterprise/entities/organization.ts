import { Entity } from "~/core/entity/entity";

import type { UniqueEntityID } from "~/core/entity/unique-entity-id";
import type { Optional } from "~/core/types/optional";
import type { Password } from "./value-object/password";

export interface OrganizationProps {
  name: string;
  email: string;
  password: Password;
  logoUrl: string;
  phone: string;
  totalAddresses: number;
  createdAt: Date;
  updatedAt: Date;
}

export class Organization extends Entity<OrganizationProps> {
  public canContinue() {
    return this.totalAddresses > 0;
  }

  public increaseAddressCounter(total = 1) {
    this.totalAddress = this.totalAddresses + total;
  }

  private set totalAddress(total: number) {
    this.props.totalAddresses = total;
  }

  private get totalAddresses() {
    return this.values.totalAddresses;
  }

  public static create(
    props: Optional<OrganizationProps, "createdAt" | "updatedAt" | "totalAddresses">,
    id?: UniqueEntityID,
  ) {
    return new Organization(
      {
        ...props,
        totalAddresses: props.totalAddresses ?? 0,
        createdAt: props.createdAt ?? new Date(),
        updatedAt: props.updatedAt ?? new Date(),
      },
      id,
    );
  }
}
