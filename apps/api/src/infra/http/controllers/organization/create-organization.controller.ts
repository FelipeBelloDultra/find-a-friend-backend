import { BadRequestException, Body, ConflictException, Controller, HttpCode, Post } from "@nestjs/common";
import { z } from "zod";

import { OrganizationAlreadyExists } from "~/domain/organization/application/use-cases/errors/organization-already-exists";
import { CreateOrganization } from "~/domain/organization/application/use-cases/create-organization";
import { Public } from "~/infra/auth/public";

import { ZodValidationPipe } from "../../pipes/zod-validation-pipe";

const createOrganizationBodySchema = z.object({
  name: z.string().min(5).max(255),
  email: z.string().email().max(255),
  password: z.string().min(6).max(255),
  phone: z
    .string()
    .regex(
      /^((\+?55 ?[1-9]{2} ?)|(\+?55 ?\([1-9]{2}\) ?)|(0[1-9]{2} ?)|(\([1-9]{2}\) ?)|([1-9]{2} ?))((\d{4}-?\d{4})|(9[1-9]{1}\d{3}-?\d{4}))$/,
    ),
});

const bodyValidationPipe = new ZodValidationPipe(createOrganizationBodySchema);

type CreateOrganizationSchema = z.infer<typeof createOrganizationBodySchema>;

@Controller("/orgs")
@Public()
export class CreateOrganizationController {
  public constructor(private readonly createOrganization: CreateOrganization) {}

  @Post()
  @HttpCode(201)
  public async handle(@Body(bodyValidationPipe) body: CreateOrganizationSchema) {
    const { email, name, password, phone } = body;

    const result = await this.createOrganization.execute({
      email,
      name,
      password,
      phone,
    });

    if (result.isLeft()) {
      // TODO: Create presenter
      switch (result.value.constructor) {
        case OrganizationAlreadyExists:
          throw new ConflictException("Email already used.");
        default:
          throw new BadRequestException(result.value.message); // TODO: Fix default error
      }
    }
  }
}
