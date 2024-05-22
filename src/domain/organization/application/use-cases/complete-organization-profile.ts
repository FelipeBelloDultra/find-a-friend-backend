import { right } from "~/core/either";

import type { UseCase } from "~/application/use-case";
import type { Either } from "~/core/either";
import type { OrganizationRepository } from "~/domain/organization/application/repository/organization-repository";

interface CompleteOrganizationProfileInput {
  organizationId: string;
}
type OnLeft = never;
type OnRight = void;

type CompleteOrganizationProfileOutput = Promise<Either<OnLeft, OnRight>>;

export class CompleteOrganizationProfile
  implements UseCase<CompleteOrganizationProfileInput, CompleteOrganizationProfileOutput>
{
  public constructor(private readonly organizationRepository: OrganizationRepository) {}

  public async execute(input: CompleteOrganizationProfileInput): CompleteOrganizationProfileOutput {
    const organization = await this.organizationRepository.findById(input.organizationId);
    if (organization && !organization.canContinue()) {
      organization.completeProfile();

      await this.organizationRepository.save(organization);
    }

    return right(void 0);
  }
}
