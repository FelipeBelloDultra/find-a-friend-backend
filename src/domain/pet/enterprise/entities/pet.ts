import { Entity } from "~/core/entity/entity";
import { UniqueEntityID } from "~/core/entity/unique-entity-id";

export interface PetProps {
  organizationId: UniqueEntityID;
  name: string;
  about: string;
  size: "SMALL" | "MEDIUM" | "LARGE";
  energyLevel: "LOW" | "MODERATE" | "MEDIUM" | "HIGH";
  environment: "SMALL" | "MEDIUM" | "LARGE";
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

  static create(props: PetProps, id?: UniqueEntityID) {
    return new Pet(props, id);
  }
}
