import { Module } from "@nestjs/common";

import { AdoptionRepository } from "~/domain/adoption/application/repository/adoption-repository";
import { OrganizationRepository } from "~/domain/organization/application/repository/organization-repository";
import { OrganizationAddressRepository } from "~/domain/organization/application/repository/organization-address-repository";
import { PetRepository } from "~/domain/pet/application/repository/pet-repository";

import { PrismaOrganizationRepository } from "../repository/prisma-organization-repository";
import { PrismaAdoptionRepository } from "../repository/prisma-adoption-repository";
import { PrismaOrganizationAddressRepository } from "../repository/prisma-organization-address-repository";
import { PrismaPetRepository } from "../repository/prisma-pet-repository";

import { PrismaService } from "./prisma/prisma.service";

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
