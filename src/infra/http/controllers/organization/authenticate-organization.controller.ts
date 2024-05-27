import { BadRequestException, Body, Controller, HttpCode, Post, Res, UnauthorizedException } from "@nestjs/common";
import { z } from "zod";
import { Response } from "express";

import { InvalidCredentials } from "~/domain/organization/application/use-cases/errors/invalid-credentials";
import { AuthenticateOrganization } from "~/domain/organization/application/use-cases/authenticate-organization";
import { Public } from "~/infra/auth/public";

import { ZodValidationPipe } from "../../pipes/zod-validation-pipe";

const authenticateOrganizationBodySchema = z.object({
  email: z.string().email().max(255),
  password: z.string().min(6).max(255),
});

const bodyValidationPipe = new ZodValidationPipe(authenticateOrganizationBodySchema);

type AuthenticateOrganizationSchema = z.infer<typeof authenticateOrganizationBodySchema>;

@Controller("/session")
@Public()
export class AuthenticateOrganizationController {
  public constructor(private readonly authenticateOrganization: AuthenticateOrganization) {}

  @Post()
  @HttpCode(200)
  public async create(@Body(bodyValidationPipe) body: AuthenticateOrganizationSchema, @Res() response: Response) {
    const { email, password } = body;

    const result = await this.authenticateOrganization.execute({
      email,
      password,
    });

    if (result.isRight()) {
      const { accessToken, refreshToken } = result.value;

      response.cookie("refreshToken", refreshToken, {
        path: "/",
        secure: true,
        sameSite: true,
        httpOnly: true,
      });
      return response.json({
        status: "success",
        error: {},
        data: {
          token: accessToken,
        },
      });
    }

    switch (result.value.constructor) {
      case InvalidCredentials:
        throw new UnauthorizedException("Invalid credentials.");
      default:
        throw new BadRequestException(result.value.message); // TODO: Fix it
    }
  }
}
