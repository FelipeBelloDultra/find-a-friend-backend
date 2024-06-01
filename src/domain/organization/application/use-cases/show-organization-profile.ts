import { Injectable } from "@nestjs/common";

import { Either, left, right } from "~/core/either";
import { OrganizationRepository } from "~/domain/organization/application/repository/organization-repository";
import { Organization } from "~/domain/organization/enterprise/entities/organization";

import { OrganizationNotFound } from "./errors/organization-not-found";

interface ShowOrganizationProfileInput {
  organizationId: string;
}

type ShowOrganizationProfileOutput = Either<OrganizationNotFound, { organization: Organization }>;

@Injectable()
export class ShowOrganizationProfile {
  public constructor(private readonly organizationRepository: OrganizationRepository) {}

  public async execute(input: ShowOrganizationProfileInput): Promise<ShowOrganizationProfileOutput> {
    const organization = await this.organizationRepository.findById(input.organizationId);
    if (!organization) {
      return left(new OrganizationNotFound());
    }

    return right({
      organization,
    });
  }
}
