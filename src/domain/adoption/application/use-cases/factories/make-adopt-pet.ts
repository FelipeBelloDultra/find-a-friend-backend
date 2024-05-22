import { PrismaPetRepository } from "~/infra/repository/prisma-pet-repository";
import { PrismaOrganizationRepository } from "~/infra/repository/prisma-organization-repository";
import { PrismaAdoptionRepository } from "~/infra/repository/prisma-adoption-repository";

import { AdoptPet } from "../adopt-pet";

export function makeAdoptPet() {
  const prismaPetRepository = new PrismaPetRepository();
  const prismaOrganizationRepository = new PrismaOrganizationRepository();
  const prismaAdoptionRepository = new PrismaAdoptionRepository();

  return new AdoptPet(prismaAdoptionRepository, prismaOrganizationRepository, prismaPetRepository);
}
