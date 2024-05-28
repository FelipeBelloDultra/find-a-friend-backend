import { BadRequestException, Body, Controller, HttpCode, NotFoundException, Post } from "@nestjs/common";
import { z } from "zod";

import { UserPayload } from "~/infra/auth/jwt.strategy";
import { CurrentUser } from "~/infra/auth/current-user-decorator";
import { OrganizationNotFound } from "~/domain/organization/application/use-cases/errors/organization-not-found";
import { CreateOrganizationAddress } from "~/domain/organization/application/use-cases/create-organization-address";

import { ZodValidationPipe } from "../../pipes/zod-validation-pipe";

const createOrganizationAddressBodySchema = z.object({
  zipcode: z.string().max(255),
  state: z.string().max(255),
  city: z.string().max(255),
  neighborhood: z.string().max(255),
  street: z.string().max(255),
  number: z.string().max(255),
  latitude: z.number(),
  longitude: z.number(),
  complement: z.string().max(255).nullable(),
});

const bodyValidationPipe = new ZodValidationPipe(createOrganizationAddressBodySchema);

type CreateOrganizationAddressSchema = z.infer<typeof createOrganizationAddressBodySchema>;

@Controller("/orgs/address")
export class CreateOrganizationAddressController {
  public constructor(private readonly createOrganizationAddress: CreateOrganizationAddress) {}

  @Post()
  @HttpCode(201)
  public async handle(
    @CurrentUser() user: UserPayload,
    @Body(bodyValidationPipe) body: CreateOrganizationAddressSchema,
  ) {
    const { city, complement, latitude, longitude, neighborhood, number, state, street, zipcode } = body;
    const authenticatedId = user.sub;

    const result = await this.createOrganizationAddress.execute({
      city,
      complement,
      latitude,
      longitude,
      neighborhood,
      number,
      state,
      street,
      zipcode,
      organizationId: authenticatedId,
    });

    if (result.isRight()) {
      return {
        data: result.value.organizationAddress.id.toValue(),
      };
    }

    switch (result.value.constructor) {
      case OrganizationNotFound:
        throw new NotFoundException("Organization not found.");
      default:
        throw new BadRequestException(result.value.message); // TODO: Fix it
    }
  }
}
