import { Address } from "~/domain/organization/enterprise/entities/address";

export interface OrganizationAddressRepository {
  create: (address: Address) => Promise<Address>;
}
