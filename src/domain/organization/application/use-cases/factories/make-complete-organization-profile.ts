import { PrismaOrganizationRepository } from "~/infra/repository/prisma-organization-repository";

import { CompleteOrganizationProfile } from "../complete-organization-profile";

export function makeCompleteOrganizationProfile() {
  const prismaOrganizationRepository = new PrismaOrganizationRepository();

  return new CompleteOrganizationProfile(prismaOrganizationRepository);
}
