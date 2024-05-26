import type { Organization } from "~/domain/organization/enterprise/entities/organization";

export abstract class OrganizationRepository {
  public abstract create: (organization: Organization) => Promise<Organization>;
  public abstract findByEmail: (email: string) => Promise<Organization | null>;
  public abstract findById: (id: string) => Promise<Organization | null>;
  public abstract save: (organization: Organization) => Promise<Organization>;
}
