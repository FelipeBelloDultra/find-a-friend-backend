import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { InvalidCredentials } from "~/domain/organization/application/use-cases/errors/invalid-credentials";
import { makeAuthenticateOrganization } from "~/domain/organization/application/use-cases/factories/make-authenticate-organization";

export async function authenticateOrganizationController(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const authenticateOrganizationSchema = z.object({
    email: z.string().email().max(255),
    password: z.string().min(6).max(255),
  });

  const { email, password } = authenticateOrganizationSchema.parse(
    request.body
  );

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
      }
    );
    const refreshToken = await reply.jwtSign(
      { email },
      {
        sign: {
          sub: id,
          expiresIn: "7d",
        },
      }
    );

    return reply
      .status(200)
      .setCookie("refreshToken", refreshToken, {
        path: "/",
        secure: true,
        sameSite: true,
        httpOnly: true,
      })
      .send({
        token,
      });
  }

  if (result.isLeft() && result.value instanceof InvalidCredentials) {
    return reply.status(401).send({
      message: "Invalid credentials.",
    });
  }

  throw result.value;
}
