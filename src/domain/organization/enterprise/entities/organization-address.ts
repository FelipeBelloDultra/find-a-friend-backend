import { Entity } from "~/core/entity/entity";

import type { UniqueEntityID } from "~/core/entity/unique-entity-id";
import type { Optional } from "~/core/types/optional";

export interface OrganizationAddressProps {
  organizationId: UniqueEntityID;
  zipcode: string;
  state: string;
  city: string;
  neighborhood: string;
  street: string;
  number: string;
  latitude: number;
  longitude: number;
  complement: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export class OrganizationAddress extends Entity<OrganizationAddressProps> {
  public static create(props: Optional<OrganizationAddressProps, "createdAt" | "updatedAt">, id?: UniqueEntityID) {
    return new OrganizationAddress(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
        updatedAt: props.updatedAt ?? new Date(),
      },
      id,
    );
  }
}
