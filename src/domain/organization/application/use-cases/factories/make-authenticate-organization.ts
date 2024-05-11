import { AuthenticateOrganization } from "../authenticate-organization";
import { PrismaOrganizationRepository } from "~/infra/repository/prisma-organization-repository";

export function makeAuthenticateOrganization() {
  const prismaOrganizationRepository = new PrismaOrganizationRepository();

  return new AuthenticateOrganization(prismaOrganizationRepository);
}
