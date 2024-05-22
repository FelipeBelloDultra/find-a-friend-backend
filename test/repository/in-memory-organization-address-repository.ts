import type { OrganizationAddress } from "~/domain/organization/enterprise/entities/organization-address";
import type { OrganizationAddressRepository } from "~/domain/organization/application/repository/organization-address-repository";

export class InMemoryOrganizationAddressRepository implements OrganizationAddressRepository {
  public readonly organizationAddresses: Array<OrganizationAddress> = [];

  public async create(organizationAddress: OrganizationAddress): Promise<OrganizationAddress> {
    this.organizationAddresses.push(organizationAddress);

    return organizationAddress;
  }
}
