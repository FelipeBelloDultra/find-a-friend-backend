// import { OrganizationNotFound } from "~/domain/organization/application/use-cases/errors/organization-not-found";
// import { makeShowOrganizationProfile } from "~/domain/organization/application/use-cases/factories/make-show-organization-profile";
// import { HttpPresenter } from "~/infra/http/http-presenter";

// import type { FastifyReply, FastifyRequest } from "fastify";

// export async function showOrganizationProfileController(request: FastifyRequest, reply: FastifyReply) {
//   const result = await makeShowOrganizationProfile().execute({
//     organizationId: request.user.sub,
//   });

//   if (result.isRight()) {
//     const { organization } = result.value;

//     return HttpPresenter.ok(reply, {
//       id: organization.id.toValue(),
//       name: organization.values.name,
//       email: organization.values.email,
//       logo_url: organization.values.logoUrl,
//       phone: organization.values.phone,
//       profile_is_completed: organization.canContinue(),
//       created_at: organization.values.createdAt,
//     });
//   }

//   if (result.isLeft() && result.value instanceof OrganizationNotFound) {
//     return HttpPresenter.notFound(reply, {
//       message: "Organization not found.",
//     });
//   }

//   throw result.value;
// }
