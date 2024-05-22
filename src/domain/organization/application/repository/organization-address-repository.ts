import type { OrganizationAddress } from "~/domain/organization/enterprise/entities/organization-address";

export interface OrganizationAddressRepository {
  create: (organizationAddress: OrganizationAddress) => Promise<OrganizationAddress>;
}
