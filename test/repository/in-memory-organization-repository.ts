import type { OrganizationRepository } from "~/domain/organization/application/repository/organization-repository";
import type { Organization } from "~/domain/organization/enterprise/entities/organization";

export class InMemoryOrganizationRepository implements OrganizationRepository {
  public readonly organizations: Array<Organization> = [];

  public constructor() {}

  public async create(organization: Organization): Promise<Organization> {
    this.organizations.push(organization);

    return organization;
  }

  public async findByEmail(email: string): Promise<Organization | null> {
    const organization = this.organizations.find((organization) => organization.values.email === email);

    if (!organization) return null;

    return organization;
  }

  public async findById(id: string): Promise<Organization | null> {
    const organization = this.organizations.find((organization) => organization.id.toValue() === id);

    if (!organization) return null;

    return organization;
  }

  public async save(organization: Organization): Promise<Organization> {
    const orgIndex = this.organizations.findIndex(({ id }) => organization.id.equals(id));

    if (orgIndex !== -1) {
      this.organizations[orgIndex] = organization;
    }

    return organization;
  }
}
