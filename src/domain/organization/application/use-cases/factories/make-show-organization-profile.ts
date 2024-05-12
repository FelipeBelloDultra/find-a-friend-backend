import { ShowOrganizationProfile } from "../show-organization-profile";
import { PrismaOrganizationRepository } from "~/infra/repository/prisma-organization-repository";

export function makeShowOrganizationProfile() {
  const prisma = new PrismaOrganizationRepository();

  return new ShowOrganizationProfile(prisma);
}
