import { z } from "zod";

import { InvalidCredentials } from "~/domain/organization/application/use-cases/errors/invalid-credentials";
import { makeAuthenticateOrganization } from "~/domain/organization/application/use-cases/factories/make-authenticate-organization";
import { HttpPresenter } from "~/infra/http/http-presenter";

import type { FastifyReply, FastifyRequest } from "fastify";

export async function authenticateOrganizationController(request: FastifyRequest, reply: FastifyReply) {
  const authenticateOrganizationSchema = z.object({
    email: z.string().email().max(255),
    password: z.string().min(6).max(255),
  });

  const { email, password } = authenticateOrganizationSchema.parse(request.body);

  const result = await makeAuthenticateOrganization().execute({
    email,
    password,
  });

  if (result.isRight()) {
    const { email, id } = result.value;

    const token = await reply.jwtSign(
      { email },
      {
        sign: {
          sub: id,
        },
      },
    );
    const refreshToken = await reply.jwtSign(
      { email },
      {
        sign: {
          sub: id,
          expiresIn: "7d",
        },
      },
    );

    return HttpPresenter.ok(
      reply.setCookie("refreshToken", refreshToken, {
        path: "/",
        secure: true,
        sameSite: true,
        httpOnly: true,
      }),
      { token },
    );
  }

  if (result.isLeft() && result.value instanceof InvalidCredentials) {
    return HttpPresenter.unauthorized(reply, {
      message: "Invalid credentials.",
    });
  }

  throw result.value;
}
