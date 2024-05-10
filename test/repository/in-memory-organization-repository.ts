import { OrganizationRepository } from "~/domain/organization/application/repository/organization-repository";
import { Organization } from "~/domain/organization/enterprise/entities/organization";

export class InMemoryOrganizationRepository implements OrganizationRepository {
  public readonly organizations: Array<Organization> = [];

  async create(organization: Organization): Promise<Organization> {
    this.organizations.push(organization);

    return organization;
  }

  async findByEmail(email: string): Promise<Organization | null> {
    const organization = this.organizations.find(
      (organization) => organization.email === email
    );

    if (!organization) return null;

    return organization;
  }
}
