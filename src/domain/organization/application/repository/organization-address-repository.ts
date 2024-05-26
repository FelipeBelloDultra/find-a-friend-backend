import type { OrganizationAddress } from "~/domain/organization/enterprise/entities/organization-address";

export abstract class OrganizationAddressRepository {
  public abstract create: (organizationAddress: OrganizationAddress) => Promise<OrganizationAddress>;
  public abstract findById: (organizationAddressId: string) => Promise<OrganizationAddress | null>;
}
