import { Injectable } from "@nestjs/common";

import { Either, left, right } from "~/core/either";
import { UseCase } from "~/application/use-case";
import { OrganizationRepository } from "~/domain/organization/application/repository/organization-repository";
import { Organization } from "~/domain/organization/enterprise/entities/organization";

import { OrganizationNotFound } from "./errors/organization-not-found";

interface ShowOrganizationProfileInput {
  organizationId: string;
}
type OnLeft = OrganizationNotFound;
type OnRight = { organization: Organization };

type ShowOrganizationProfileOutput = Promise<Either<OnLeft, OnRight>>;

@Injectable()
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
