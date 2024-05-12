import { left, right } from "~/core/either";

import { OrganizationNotFound } from "./errors/organization-not-found";

import type { UseCase } from "~/application/use-case";
import type { Either } from "~/core/either";
import type { OrganizationRepository } from "~/domain/organization/application/repository/organization-repository";
import type { Organization } from "~/domain/organization/enterprise/entities/organization";

interface ShowOrganizationProfileInput {
  organizationId: string;
}
type OnLeft = OrganizationNotFound;
type OnRight = { organization: Organization };

type ShowOrganizationProfileOutput = Promise<Either<OnLeft, OnRight>>;

export class ShowOrganizationProfile implements UseCase<ShowOrganizationProfileInput, ShowOrganizationProfileOutput> {
  public constructor(private readonly organizationRepository: OrganizationRepository) {}

  public async execute(input: ShowOrganizationProfileInput): ShowOrganizationProfileOutput {
    const organization = await this.organizationRepository.findById(input.organizationId);
    if (!organization) {
      return left(new OrganizationNotFound());
    }

    return right({
      organization,
    });
  }
}
