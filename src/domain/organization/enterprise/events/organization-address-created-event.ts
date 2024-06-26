import { UniqueEntityID } from "~/core/entity/unique-entity-id";
import { DomainEvent } from "~/core/events/domain-event";
import { OrganizationAddress } from "~/domain/organization/enterprise/entities/organization-address";

export class OrganizationAddressCreatedEvent implements DomainEvent {
  public ocurredAt: Date;
  public organizationAddress: OrganizationAddress;

  public constructor(organizationAddress: OrganizationAddress) {
    this.organizationAddress = organizationAddress;
    this.ocurredAt = new Date();
  }

  public getAggregateId(): UniqueEntityID {
    return this.organizationAddress.id;
  }
}
