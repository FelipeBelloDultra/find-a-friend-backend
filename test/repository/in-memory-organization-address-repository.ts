import { DomainEvents } from "~/core/events/domain-events";
import { OrganizationAddress } from "~/domain/organization/enterprise/entities/organization-address";
import { OrganizationAddressRepository } from "~/domain/organization/application/repository/organization-address-repository";

export class InMemoryOrganizationAddressRepository implements OrganizationAddressRepository {
  public readonly organizationAddresses: Array<OrganizationAddress> = [];

  public async create(organizationAddress: OrganizationAddress): Promise<OrganizationAddress> {
    this.organizationAddresses.push(organizationAddress);

    DomainEvents.dispatchEventsForAggregate(organizationAddress.id);

    return organizationAddress;
  }

  public async findById(organizationAddressId: string): Promise<OrganizationAddress | null> {
    const organizationAddress = this.organizationAddresses.find(
      (organizationAddress) => organizationAddress.id.toValue() === organizationAddressId,
    );

    if (!organizationAddress) return null;

    return organizationAddress;
  }
}
