import { CreateOrganization } from "../create-organization";
import { PrismaOrganizationRepository } from "~/infra/repository/prisma-organization-repository";

export function makeCreateOrganization() {
  const prismaOrganizationRepository = new PrismaOrganizationRepository();

  return new CreateOrganization(prismaOrganizationRepository);
}
