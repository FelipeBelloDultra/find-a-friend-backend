import { UpdateOrganizationAddress } from "../update-organization-address";
import { PrismaOrganizationRepository } from "~/infra/repository/prisma-organization-repository";

export function makeUpdateOrganizationAddress() {
  const prismaOrganizationRepository = new PrismaOrganizationRepository();

  return new UpdateOrganizationAddress(prismaOrganizationRepository);
}
