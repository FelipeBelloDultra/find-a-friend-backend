import { Entity } from "~/core/entity/entity";
import { UniqueEntityID } from "~/core/entity/unique-entity-id";
import { Optional } from "~/core/types/optional";

import { AdoptionStatus } from "./value-object/adoption-status";

export type PetSize = "SMALL" | "MEDIUM" | "LARGE";
export type PetEnvironmentSize = "SMALL" | "MEDIUM" | "LARGE";
export type PetEnergyLevel = "LOW" | "MODERATE" | "MEDIUM" | "HIGH";

export interface PetProps {
  organizationId: UniqueEntityID;
  organizationAddressId: UniqueEntityID;
  name: string;
  about: string;
  adoptionStatus: AdoptionStatus;
  size: PetSize;
  energyLevel: PetEnergyLevel;
  environmentSize: PetEnvironmentSize;
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
