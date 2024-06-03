import { Organization } from "~/domain/organization/enterprise/entities/organization";

export class OrganizationPresenter {
  public static toHTTP(organization: Organization) {
    return {
      id: organization.id.toValue(),
      name: organization.values.name,
      email: organization.values.email,
      logo_url: organization.values.logoUrl,
      phone: organization.values.phone,
      profile_is_completed: organization.canContinue(),
      created_at: organization.values.createdAt,
    };
  }
}
