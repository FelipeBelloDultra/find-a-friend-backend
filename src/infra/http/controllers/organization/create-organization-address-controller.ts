import { z } from "zod";

import { OrganizationNotFound } from "~/domain/organization/application/use-cases/errors/organization-not-found";
import { makeCreateOrganizationAddress } from "~/domain/organization/application/use-cases/factories/make-create-organization-address";

import type { FastifyReply, FastifyRequest } from "fastify";

export async function createOrganizationAddressController(request: FastifyRequest, reply: FastifyReply) {
  const createOrganizationAddressSchema = z.object({
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

  const organizationId = request.user.sub;
  const { city, complement, latitude, longitude, neighborhood, number, state, street, zipcode } =
    createOrganizationAddressSchema.parse(request.body);

  const result = await makeCreateOrganizationAddress().execute({
    organizationId,
    city,
    complement,
    latitude,
    longitude,
    neighborhood,
    number,
    state,
    street,
    zipcode,
  });

  if (result.isRight()) {
    return reply.status(201).send();
  }

  if (result.isLeft() && result.value instanceof OrganizationNotFound) {
    return reply.status(404).send({
      message: "Organization not found.",
    });
  }

  throw result.value;
}
