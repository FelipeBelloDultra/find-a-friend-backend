import { PrismaOrganizationRepository } from "~/infra/repository/prisma-organization-repository";

import { CreateOrganization } from "../create-organization";

export function makeCreateOrganization() {
  const prismaOrganizationRepository = new PrismaOrganizationRepository();

  return new CreateOrganization(prismaOrganizationRepository);
}
