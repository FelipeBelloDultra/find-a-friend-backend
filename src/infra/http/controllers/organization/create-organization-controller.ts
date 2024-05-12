import { z } from "zod";
import { FastifyReply, FastifyRequest } from "fastify";

import { makeCreateOrganization } from "~/domain/organization/application/use-cases/factories/make-create-organization";
import { OrganizationAlreadyExists } from "~/domain/organization/application/use-cases/errors/organization-already-exists";

export async function createOrganizationController(request: FastifyRequest, reply: FastifyReply) {
  const createOrganizationSchema = z.object({
    name: z.string().min(5).max(255),
    logoUrl: z.string(),
    email: z.string().email().max(255),
    password: z.string().min(6).max(255),
    phone: z
      .string()
      .regex(
        /^((\+?55 ?[1-9]{2} ?)|(\+?55 ?\([1-9]{2}\) ?)|(0[1-9]{2} ?)|(\([1-9]{2}\) ?)|([1-9]{2} ?))((\d{4}-?\d{4})|(9[1-9]{1}\d{3}-?\d{4}))$/,
      ),
  });

  const requestBody = createOrganizationSchema.parse(request.body);

  const result = await makeCreateOrganization().execute({
    email: requestBody.email,
    logoUrl: requestBody.logoUrl,
    name: requestBody.name,
    password: requestBody.password,
    phone: requestBody.phone,
  });

  if (result.isRight()) {
    return reply.status(201).send();
  }

  if (result.isLeft() && result.value instanceof OrganizationAlreadyExists) {
    return reply.status(409).send({
      message: "Email already used.",
    });
  }

  throw result.value;
}
