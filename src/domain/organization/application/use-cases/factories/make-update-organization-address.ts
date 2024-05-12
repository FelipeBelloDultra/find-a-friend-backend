import { PrismaOrganizationRepository } from "~/infra/repository/prisma-organization-repository";

import { UpdateOrganizationAddress } from "../update-organization-address";

export function makeUpdateOrganizationAddress() {
  const prismaOrganizationRepository = new PrismaOrganizationRepository();

  return new UpdateOrganizationAddress(prismaOrganizationRepository);
}
