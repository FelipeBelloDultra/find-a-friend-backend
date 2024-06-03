import { Injectable } from "@nestjs/common";

import { Either, right } from "~/core/either";
import { OrganizationRepository } from "~/domain/organization/application/repository/organization-repository";

interface CompleteOrganizationProfileInput {
  organizationId: string;
}

type CompleteOrganizationProfileOutput = Either<never, void>;

@Injectable()
export class CompleteOrganizationProfile {
  public constructor(private readonly organizationRepository: OrganizationRepository) {}

  public async execute(input: CompleteOrganizationProfileInput): Promise<CompleteOrganizationProfileOutput> {
    const organization = await this.organizationRepository.findById(input.organizationId);
    if (organization && !organization.canContinue()) {
      organization.completeProfile();

      await this.organizationRepository.save(organization);
    }

    return right(void 0);
  }
}
