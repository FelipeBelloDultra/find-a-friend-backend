import { AggregateRoot } from "~/core/entity/aggregate-root";
import { OrganizationAddressCreatedEvent } from "~/domain/organization/enterprise/events/organization-address-created-event";

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

export class OrganizationAddress extends AggregateRoot<OrganizationAddressProps> {
  public static create(props: Optional<OrganizationAddressProps, "createdAt" | "updatedAt">, id?: UniqueEntityID) {
    const organizationAddress = new OrganizationAddress(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
        updatedAt: props.updatedAt ?? new Date(),
      },
      id,
    );

    const isNewOrganizationAddress = !id;

    if (isNewOrganizationAddress) {
      organizationAddress.addDomainEvent(new OrganizationAddressCreatedEvent(organizationAddress));
    }

    return organizationAddress;
  }
}
