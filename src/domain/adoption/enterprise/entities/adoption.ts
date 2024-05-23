import { Entity } from "~/core/entity/entity";
import { UniqueEntityID } from "~/core/entity/unique-entity-id";

import type { Optional } from "~/core/types/optional";

export interface AdoptionProps {
  petId: UniqueEntityID;
  organizationId: UniqueEntityID;
  adopterName: string;
  adopterEmail: string;
  adopterPhone: string;
  adoptionCode: UniqueEntityID;
  createdAt: Date;
  expiresAt: Date;
  confirmedAt: Date | null;
}

export class Adoption extends Entity<AdoptionProps> {
  private static generateAdoptionCode() {
    return new UniqueEntityID();
  }

  private static setAdoptionExpiresDate() {
    const EXPIRATION_IN_MINUTES = 15;

    const expiresTime = new Date();
    expiresTime.setMinutes(expiresTime.getMinutes() + EXPIRATION_IN_MINUTES);

    return expiresTime;
  }

  public confirmAdoption() {
    this.props.confirmedAt = new Date();
    // this.addDomainEvent(new AdoptionConfirmed(this.id)); // TODO: add domain event when an adoption is confirmed
  }

  public static create(
    props: Optional<AdoptionProps, "createdAt" | "confirmedAt" | "adoptionCode" | "expiresAt">,
    id?: UniqueEntityID,
  ) {
    return new Adoption(
      {
        ...props,
        expiresAt: props.expiresAt ?? this.setAdoptionExpiresDate(),
        createdAt: props.createdAt ?? new Date(),
        confirmedAt: props.confirmedAt ?? null,
        adoptionCode: props.adoptionCode ?? this.generateAdoptionCode(),
      },
      id,
    );
  }
}
