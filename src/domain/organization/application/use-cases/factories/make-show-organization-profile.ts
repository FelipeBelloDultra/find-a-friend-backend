import { PrismaOrganizationRepository } from "~/infra/repository/prisma-organization-repository";

import { ShowOrganizationProfile } from "../show-organization-profile";

export function makeShowOrganizationProfile() {
  const prisma = new PrismaOrganizationRepository();

  return new ShowOrganizationProfile(prisma);
}
