import { Module } from "@nestjs/common";

import { AdoptionRepository } from "~/domain/adoption/application/repository/adoption-repository";
import { OrganizationRepository } from "~/domain/organization/application/repository/organization-repository";
import { OrganizationAddressRepository } from "~/domain/organization/application/repository/organization-address-repository";
import { PetRepository } from "~/domain/pet/application/repository/pet-repository";

import { PrismaService } from "./prisma/prisma.service";
import { PrismaOrganizationRepository } from "./prisma/repositories/prisma-organization-repository";
import { PrismaAdoptionRepository } from "./prisma/repositories/prisma-adoption-repository";
import { PrismaOrganizationAddressRepository } from "./prisma/repositories/prisma-organization-address-repository";
import { PrismaPetRepository } from "./prisma/repositories/prisma-pet-repository";

@Module({
  providers: [
    PrismaService,
    {
      provide: AdoptionRepository,
      useClass: PrismaAdoptionRepository,
    },
    {
      provide: OrganizationRepository,
      useClass: PrismaOrganizationRepository,
    },
    {
      provide: OrganizationAddressRepository,
      useClass: PrismaOrganizationAddressRepository,
    },
    {
      provide: PetRepository,
      useClass: PrismaPetRepository,
    },
  ],
  exports: [PrismaService, AdoptionRepository, OrganizationRepository, OrganizationAddressRepository, PetRepository],
})
export class DatabaseModule {}
