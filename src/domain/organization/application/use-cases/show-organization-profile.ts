import { UseCase } from "~/core/entity/use-case";
import { Either, left, right } from "~/core/either";

import { OrganizationRepository } from "~/domain/organization/application/repository/organization-repository";
import { Organization } from "~/domain/organization/enterprise/entities/organization";

import { OrganizationNotFound } from "~/core/errors/organization-not-found";

interface ShowOrganizationProfileInput {
  organizationId: string;
}
type OnLeft = OrganizationNotFound;
type OnRight = { organization: Organization };

type ShowOrganizationProfileOutput = Promise<Either<OnLeft, OnRight>>;

export class ShowOrganizationProfile
  implements
    UseCase<ShowOrganizationProfileInput, ShowOrganizationProfileOutput>
{
  constructor(
    private readonly organizationRepository: OrganizationRepository
  ) {}

  async execute(
    input: ShowOrganizationProfileInput
  ): ShowOrganizationProfileOutput {
    const organization = await this.organizationRepository.findById(
      input.organizationId
    );
    if (!organization) {
      return left(new OrganizationNotFound());
    }

    return right({
      organization,
    });
  }
}
