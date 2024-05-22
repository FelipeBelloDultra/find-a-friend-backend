import { Entity } from "~/core/entity/entity";

import type { UniqueEntityID } from "~/core/entity/unique-entity-id";
import type { Optional } from "~/core/types/optional";

export interface PetProps {
  organizationId: UniqueEntityID;
  organizationAddressId: UniqueEntityID;
  name: string;
  about: string;
  adopted: boolean;
  size: "SMALL" | "MEDIUM" | "LARGE";
  energyLevel: "LOW" | "MODERATE" | "MEDIUM" | "HIGH";
  environment: "SMALL" | "MEDIUM" | "LARGE";
  createdAt: Date;
  updatedAt: Date;
}

export class Pet extends Entity<PetProps> {
  public adopt() {
    this.props.adopted = true;
    this.props.updatedAt = new Date();
  }

  public static create(props: Optional<PetProps, "createdAt" | "updatedAt" | "adopted">, id?: UniqueEntityID) {
    return new Pet(
      {
        ...props,
        adopted: props.adopted ?? false,
        createdAt: props.createdAt ?? new Date(),
        updatedAt: props.updatedAt ?? new Date(),
      },
      id,
    );
  }
}
