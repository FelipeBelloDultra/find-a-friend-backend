import { OrganizationAddressRepository } from "~/domain/organization/application/repository/organization-address-repository";
import { Address } from "~/domain/organization/enterprise/entities/address";

export class InMemoryOrganizationAddressRepository
  implements OrganizationAddressRepository
{
  public readonly addresses: Array<Address> = [];

  async create(organization: Address): Promise<Address> {
    this.addresses.push(organization);

    return organization;
  }
}
