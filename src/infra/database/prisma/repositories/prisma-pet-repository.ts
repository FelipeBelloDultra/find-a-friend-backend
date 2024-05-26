import { Injectable } from "@nestjs/common";

import { PetMapper } from "../mappers/pet-mapper";

import type { PrismaService } from "../prisma.service";
import type { FetchManyPetsQuery } from "~/domain/pet/application/query/queries";
import type { Pet } from "~/domain/pet/enterprise/entities/pet";
import type { PaginationRepository } from "~/application/repository/pagination-repository";
import type { FindAllPetsFilters, PetRepository } from "~/domain/pet/application/repository/pet-repository";

@Injectable()
export class PrismaPetRepository implements PetRepository {
  public constructor(private readonly prisma: PrismaService) {}

  public async create(pet: Pet): Promise<Pet> {
    await this.prisma.pet.create({
      data: PetMapper.toPersistence(pet),
    });

    return pet;
  }

  public async findById(id: string): Promise<Pet | null> {
    const pet = await this.prisma.pet.findUnique({
      where: {
        id,
      },
    });

    if (!pet) return null;

    return PetMapper.toDomain(pet);
  }

  public async save(pet: Pet): Promise<Pet> {
    await this.prisma.pet.update({
      where: {
        id: pet.id.toValue(),
      },
      data: PetMapper.toPersistence(pet),
    });

    return pet;
  }

  public async findAll(
    {
      city,
      adoptionStatus,
      energyLevel,
      environment,
      size,
      organizationAddressId,
      organizationId,
      state,
    }: FindAllPetsFilters,
    { limit, page }: PaginationRepository,
  ): Promise<Array<FetchManyPetsQuery>> {
    const SKIP = (page - 1) * limit;
    const TAKE = page * limit;

    const pet = await this.prisma.pet.findMany({
      take: TAKE,
      skip: SKIP,
      orderBy: [
        {
          created_at: "desc",
        },
      ],
      select: {
        organization_address_id: true,
        id: true,
        name: true,
        energy_level: true,
        environment_size: true,
        about: true,
        size: true,
        adoption_status: true,
        created_at: true,
        updated_at: true,
        organization_id: true,
      },
      where: {
        adoption_status: adoptionStatus,
        energy_level: energyLevel,
        environment_size: environment,
        size,
        organization_address_id: organizationAddressId,
        organization_id: organizationId,
        OrganizationAddress: {
          city,
          state,
        },
      },
    });

    return pet;
  }
}
