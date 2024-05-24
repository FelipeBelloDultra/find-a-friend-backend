import { z } from "zod";

import { makeCreatePet } from "~/domain/pet/application/use-cases/factories/make-create-pet";
import { OrganizationNotFound } from "~/domain/organization/application/use-cases/errors/organization-not-found";
import { OrganizationAddressNotFound } from "~/domain/organization/application/use-cases/errors/organization-address-not-found";
import { NotAllowed } from "~/core/errors/not-allowed";

import type { FastifyReply, FastifyRequest } from "fastify";

export async function createPetController(request: FastifyRequest, reply: FastifyReply) {
  const createPetSchema = z.object({
    organization_address_id: z.string(),
    name: z.string(),
    about: z.string(),
    size: z.enum(["SMALL", "MEDIUM", "LARGE"]),
    energy_level: z.enum(["LOW", "MODERATE", "MEDIUM", "HIGH"]),
    environment_size: z.enum(["SMALL", "MEDIUM", "LARGE"]),
  });

  const requestBody = createPetSchema.parse(request.body);
  const organizationId = request.user.sub;

  const result = await makeCreatePet().execute({
    organizationId,
    organizationAddressId: requestBody.organization_address_id,
    about: requestBody.about,
    energyLevel: requestBody.energy_level,
    name: requestBody.name,
    size: requestBody.size,
    environmentSize: requestBody.environment_size,
  });

  if (result.isRight()) {
    return reply.status(201).send();
  }

  if (result.value instanceof OrganizationNotFound) {
    return reply.status(404).send({
      message: "Organization not found.",
    });
  }

  if (result.value instanceof OrganizationAddressNotFound) {
    return reply.status(404).send({
      message: "Organization address not found.",
    });
  }

  if (result.value instanceof NotAllowed) {
    return reply.status(403).send({
      message: "Not allowed.",
    });
  }

  throw result.value;
}
