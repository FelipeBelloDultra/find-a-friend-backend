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
  profileCompleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export class Organization extends Entity<OrganizationProps> {
  public canContinue() {
    return this.values.profileCompleted;
  }

  public completeProfile() {
    this.profileCompleted = true;
  }

  private set profileCompleted(profileCompleted: boolean) {
    this.props.profileCompleted = profileCompleted;
  }

  public static create(
    props: Optional<OrganizationProps, "createdAt" | "updatedAt" | "profileCompleted">,
    id?: UniqueEntityID,
  ) {
    return new Organization(
      {
        ...props,
        profileCompleted: props.profileCompleted ?? false,
        createdAt: props.createdAt ?? new Date(),
        updatedAt: props.updatedAt ?? new Date(),
      },
      id,
    );
  }
}
