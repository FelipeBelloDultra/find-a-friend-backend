import { type Organization } from "~/domain/organization/enterprise/entities/organization";

export interface OrganizationRepository {
  create: (organization: Organization) => Promise<Organization>;
  findByEmail: (email: string) => Promise<Organization | null>;
  findById: (id: string) => Promise<Organization | null>;
  save: (organization: Organization) => Promise<Organization>;
}
