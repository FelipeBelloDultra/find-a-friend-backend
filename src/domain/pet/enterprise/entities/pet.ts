import { Entity } from "~/core/entity/entity";

import type { UniqueEntityID } from "~/core/entity/unique-entity-id";
import type { Optional } from "~/core/types/optional";

export interface PetProps {
  organizationId: UniqueEntityID;
  name: string;
  about: string;
  adopted: boolean;
  size: "SMALL" | "MEDIUM" | "LARGE";
  energyLevel: "LOW" | "MODERATE" | "MEDIUM" | "HIGH";
  environment: "SMALL" | "MEDIUM" | "LARGE";
  createdAt: Date;
  adoptedAt: Date | null;
}

export class Pet extends Entity<PetProps> {
  public get organizationId() {
    return this.props.organizationId;
  }

  public get energyLevel() {
    return this.props.energyLevel;
  }

  public get size() {
    return this.props.size;
  }

  public get environment() {
    return this.props.environment;
  }

  public get adopted() {
    return this.props.adopted;
  }

  public adopt() {
    this.props.adopted = true;
    this.props.adoptedAt = new Date();
  }

  public static create(props: Optional<PetProps, "createdAt" | "adoptedAt" | "adopted">, id?: UniqueEntityID) {
    return new Pet(
      {
        ...props,
        adopted: props.adopted ?? false,
        createdAt: props.createdAt ?? new Date(),
        adoptedAt: props.adoptedAt ?? null,
      },
      id,
    );
  }
}
