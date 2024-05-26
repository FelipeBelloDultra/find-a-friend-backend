import { Injectable } from "@nestjs/common";

import { AdoptionMapper } from "../mappers/adoption-mapper";

import type { PrismaService } from "../prisma.service";
import type { FetchManyAdoptionsQuery } from "~/domain/adoption/application/query/queries";
import type { Adoption } from "~/domain/adoption/enterprise/entities/adoption";
import type { PaginationRepository } from "~/application/repository/pagination-repository";
import type {
  AdoptionRepository,
  FindAllAdoptionsFilters,
} from "~/domain/adoption/application/repository/adoption-repository";

@Injectable()
export class PrismaAdoptionRepository implements AdoptionRepository {
  public constructor(private readonly prisma: PrismaService) {}

  public async create(adoption: Adoption): Promise<Adoption> {
    await this.prisma.adoption.create({
      data: AdoptionMapper.toPersistence(adoption),
    });

    return adoption;
  }

  public async findAll(
    filters: FindAllAdoptionsFilters,
    { limit, page }: PaginationRepository,
  ): Promise<Array<FetchManyAdoptionsQuery>> {
    const SKIP = (page - 1) * limit;
    const TAKE = page * limit;

    const adoptions = await this.prisma.adoption.findMany({
      take: TAKE,
      skip: SKIP,
      select: {
        id: true,
        adopter_email: true,
        adopter_name: true,
        adopter_phone: true,
        confirmed_at: true,
        expires_at: true,
        created_at: true,
        Pet: {
          select: {
            id: true,
            updated_at: true,
            name: true,
            adoption_status: true,
          },
        },
      },
      orderBy: [
        {
          created_at: "desc",
        },
      ],
      where: {
        organization_id: filters.organizationId,
      },
    });

    return adoptions;
  }

  public async save(adoption: Adoption): Promise<Adoption> {
    await this.prisma.adoption.update({
      where: {
        id: adoption.id.toValue(),
      },
      data: AdoptionMapper.toPersistence(adoption),
    });

    return adoption;
  }

  public async findByCode(code: string): Promise<Adoption | null> {
    const adoption = await this.prisma.adoption.findUnique({
      where: {
        adoption_code: code,
      },
    });

    if (!adoption) return null;

    return AdoptionMapper.toDomain(adoption);
  }
}
