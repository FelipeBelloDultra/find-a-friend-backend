import { PrismaOrganizationRepository } from "~/infra/repository/prisma-organization-repository";

import { AuthenticateOrganization } from "../authenticate-organization";

export function makeAuthenticateOrganization() {
  const prismaOrganizationRepository = new PrismaOrganizationRepository();

  return new AuthenticateOrganization(prismaOrganizationRepository);
}
