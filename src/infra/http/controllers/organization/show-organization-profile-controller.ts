import { type FastifyReply, type FastifyRequest } from "fastify";
import { OrganizationNotFound } from "~/domain/organization/application/use-cases/errors/organization-not-found";
import { makeShowOrganizationProfile } from "~/domain/organization/application/use-cases/factories/make-show-organization-profile";

export async function showOrganizationProfileController(request: FastifyRequest, reply: FastifyReply) {
  const result = await makeShowOrganizationProfile().execute({
    organizationId: request.user.sub,
  });

  if (result.isRight()) {
    const { organization } = result.value;

    return reply.status(200).send({
      id: organization.id.toValue(),
      name: organization.name,
      email: organization.email,
      logo_url: organization.logoUrl,
      phone: organization.phone,
      profile_is_completed: organization.canContinue(),
      created_at: organization.createdAt,
    });
  }

  if (result.isLeft() && result.value instanceof OrganizationNotFound) {
    return reply.status(404).send({
      message: "Organization not found.",
    });
  }

  throw result.value;
}
