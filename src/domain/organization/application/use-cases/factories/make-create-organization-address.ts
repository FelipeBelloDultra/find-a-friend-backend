import { PrismaOrganizationAddressRepository } from "~/infra/repository/prisma-organization-address-repository";
import { PrismaOrganizationRepository } from "~/infra/repository/prisma-organization-repository";

import { CreateOrganizationAddress } from "../create-organization-address";

export function makeCreateOrganizationAddress() {
  const prismaOrganizationAddressRepository = new PrismaOrganizationAddressRepository();
  const prismaOrganizationRepository = new PrismaOrganizationRepository();

  return new CreateOrganizationAddress(prismaOrganizationRepository, prismaOrganizationAddressRepository);
}
