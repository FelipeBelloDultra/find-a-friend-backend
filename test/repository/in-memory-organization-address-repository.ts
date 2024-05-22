import type { OrganizationAddress } from "~/domain/organization/enterprise/entities/organization-address";
import type { OrganizationAddressRepository } from "~/domain/organization/application/repository/organization-address-repository";

export class InMemoryOrganizationAddressRepository implements OrganizationAddressRepository {
  public readonly organizationAddresses: Array<OrganizationAddress> = [];

  public async create(organizationAddress: OrganizationAddress): Promise<OrganizationAddress> {
    this.organizationAddresses.push(organizationAddress);

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
