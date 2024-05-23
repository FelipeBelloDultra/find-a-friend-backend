import { Entity } from "~/core/entity/entity";

import type { AdoptionStatus } from "./value-object/adoption-status";
import type { UniqueEntityID } from "~/core/entity/unique-entity-id";
import type { Optional } from "~/core/types/optional";

export interface PetProps {
  organizationId: UniqueEntityID;
  organizationAddressId: UniqueEntityID;
  name: string;
  about: string;
  adoptionStatus: AdoptionStatus;
  size: "SMALL" | "MEDIUM" | "LARGE";
  energyLevel: "LOW" | "MODERATE" | "MEDIUM" | "HIGH";
  environmentSize: "SMALL" | "MEDIUM" | "LARGE";
  createdAt: Date;
  updatedAt: Date;
}

export class Pet extends Entity<PetProps> {
  public intentionToAdopt() {
    this.props.adoptionStatus.setPending();
    this.update();
  }

  public cancelAdoption() {
    this.props.adoptionStatus.setNotAdopted();
    this.update();
  }

  public completeAdoption() {
    this.props.adoptionStatus.setAdopted();
    this.update();
  }

  private update() {
    this.props.updatedAt = new Date();
  }

  public static create(props: Optional<PetProps, "createdAt" | "updatedAt">, id?: UniqueEntityID) {
    return new Pet(
      {
        ...props,
        adoptionStatus: props.adoptionStatus,
        createdAt: props.createdAt ?? new Date(),
        updatedAt: props.updatedAt ?? new Date(),
      },
      id,
    );
  }
}
