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
  public get updatedAt() {
    return this.props.updatedAt;
  }

  public get createdAt() {
    return this.props.createdAt;
  }

  public get organizationId() {
    return this.props.organizationId;
  }

  public get organizationAddressId() {
    return this.props.organizationAddressId;
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

  public get about() {
    return this.props.about;
  }

  public get name() {
    return this.props.name;
  }

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
