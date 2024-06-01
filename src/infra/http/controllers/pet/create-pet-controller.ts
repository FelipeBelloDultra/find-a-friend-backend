import {
  BadRequestException,
  Body,
  Controller,
  ForbiddenException,
  HttpCode,
  NotFoundException,
  Post,
} from "@nestjs/common";
import { z } from "zod";

import { CreatePet } from "~/domain/pet/application/use-cases/create-pet";
import { CurrentUser } from "~/infra/auth/current-user-decorator";
import { UserPayload } from "~/infra/auth/jwt.strategy";
import { OrganizationNotFound } from "~/domain/organization/application/use-cases/errors/organization-not-found";
import { OrganizationAddressNotFound } from "~/domain/organization/application/use-cases/errors/organization-address-not-found";
import { NotAllowed } from "~/core/errors/not-allowed";

import { ZodValidationPipe } from "../../pipes/zod-validation-pipe";

const createPetSchema = z.object({
  organization_address_id: z.string(),
  name: z.string(),
  about: z.string(),
  size: z.enum(["SMALL", "MEDIUM", "LARGE"]),
  energy_level: z.enum(["LOW", "MODERATE", "MEDIUM", "HIGH"]),
  environment_size: z.enum(["SMALL", "MEDIUM", "LARGE"]),
});

const bodyValidationPipe = new ZodValidationPipe(createPetSchema);

type CreatePetSchema = z.infer<typeof createPetSchema>;

@Controller()
export class CreatePetController {
  public constructor(private readonly createPet: CreatePet) {}

  @Post("/pets")
  @HttpCode(201)
  public async handle(@CurrentUser() user: UserPayload, @Body(bodyValidationPipe) body: CreatePetSchema) {
    const { about, energy_level, environment_size, name, organization_address_id, size } = body;
    const authenticatedId = user.sub;

    const result = await this.createPet.execute({
      about,
      energyLevel: energy_level,
      environmentSize: environment_size,
      name,
      organizationAddressId: organization_address_id,
      organizationId: authenticatedId,
      size,
    });

    if (result.isRight()) {
      return {
        data: result.value.pet.id.toValue(),
      };
    }

    switch (result.value.constructor) {
      case OrganizationNotFound:
        throw new NotFoundException("Organization not found.");
      case OrganizationAddressNotFound:
        throw new NotFoundException("Organization address not found.");
      case NotAllowed:
        throw new ForbiddenException("Not allowed.");
      default:
        throw new BadRequestException(result.value.message); // TODO: Fix it
    }
  }
}
