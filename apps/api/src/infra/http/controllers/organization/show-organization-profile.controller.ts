import { BadRequestException, Controller, Get, HttpCode, NotFoundException } from "@nestjs/common";

import { UserPayload } from "~/infra/auth/jwt.strategy";
import { CurrentUser } from "~/infra/auth/current-user-decorator";
import { ShowOrganizationProfile } from "~/domain/organization/application/use-cases/show-organization-profile";
import { OrganizationNotFound } from "~/domain/organization/application/use-cases/errors/organization-not-found";

import { OrganizationPresenter } from "../../presenters/organization-presenter";
import { HttpPresenter } from "../../presenters/http-presenter";

@Controller("/auth/me")
export class ShowOrganizationProfileController {
  public constructor(private readonly showOrganizationProfile: ShowOrganizationProfile) {}

  @Get()
  @HttpCode(200)
  public async handle(@CurrentUser() user: UserPayload) {
    const authenticatedId = user.sub;

    const result = await this.showOrganizationProfile.execute({
      organizationId: authenticatedId,
    });

    if (result.isRight()) {
      const { organization } = result.value;

      return HttpPresenter.success(OrganizationPresenter.toHTTP(organization));
    }

    switch (result.value.constructor) {
      case OrganizationNotFound:
        throw new NotFoundException("Organization not found.");
      default:
        throw new BadRequestException(result.value.message); // TODO: Fix it
    }
  }
}
