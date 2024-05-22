import { PrismaOrganizationRepository } from "~/infra/repository/prisma-organization-repository";
import { PrismaOrganizationAddressRepository } from "~/infra/repository/prisma-organization-address-repository";
import { PrismaPetRepository } from "~/infra/repository/prisma-pet-repository";

import { CreatePet } from "../create-pet";

export function makeCreatePet() {
  const prismaPetRepository = new PrismaPetRepository();
  const prismaOrganizationRepository = new PrismaOrganizationRepository();
  const prismaOrganizationAddressRepository = new PrismaOrganizationAddressRepository();

  return new CreatePet(prismaOrganizationRepository, prismaOrganizationAddressRepository, prismaPetRepository);
}
