import { Entity } from "~/core/entity/entity";
import { UniqueEntityID } from "~/core/entity/unique-entity-id";

import type { ExpiresAt } from "./value-object/expires-at";
import type { Optional } from "~/core/types/optional";

export interface AdoptionProps {
  petId: UniqueEntityID;
  organizationId: UniqueEntityID;
  adopterName: string;
  adopterEmail: string;
  adopterPhone: string;
  adoptionCode: UniqueEntityID;
  createdAt: Date;
  expiresAt: ExpiresAt;
  confirmedAt: Date | null;
}

export class Adoption extends Entity<AdoptionProps> {
  private static generateAdoptionCode() {
    return new UniqueEntityID();
  }

  public wasConfirmed() {
    return !!this.values.confirmedAt;
  }

  public confirmAdoption() {
    this.props.confirmedAt = new Date();
    // this.addDomainEvent(new AdoptionConfirmed(this.id)); // TODO: add domain event when an adoption is confirmed
  }

  public static create(
    props: Optional<AdoptionProps, "createdAt" | "confirmedAt" | "adoptionCode">,
    id?: UniqueEntityID,
  ) {
    return new Adoption(
      {
        ...props,
        expiresAt: props.expiresAt,
        createdAt: props.createdAt ?? new Date(),
        confirmedAt: props.confirmedAt ?? null,
        adoptionCode: props.adoptionCode ?? this.generateAdoptionCode(),
      },
      id,
    );
  }
}
