import { AdoptionMapper } from "~/domain/adoption/application/mappers/adoption-mapper";

import { DatabaseConnection } from "../database/connection";

import type { Adoption } from "~/domain/adoption/enterprise/entities/adoption";
import type { PaginationRepository } from "~/application/repository/pagination-repository";
import type {
  AdoptionRepository,
  FindAllAdoptionsFilters,
} from "~/domain/adoption/application/repository/adoption-repository";

export class PrismaAdoptionRepository implements AdoptionRepository {
  public async create(adoption: Adoption): Promise<Adoption> {
    await DatabaseConnection.query.adoption.create({
      data: AdoptionMapper.toPersistence(adoption),
    });

    return adoption;
  }

  public async findAll(
    filters: FindAllAdoptionsFilters,
    { limit, page }: PaginationRepository,
  ): Promise<Array<Adoption>> {
    const SKIP = (page - 1) * limit;
    const TAKE = page * limit;

    const adoptions = await DatabaseConnection.query.adoption.findMany({
      take: TAKE,
      skip: SKIP,
      orderBy: [
        {
          created_at: "desc",
        },
      ],
      where: {
        organization_id: filters.organizationId,
      },
    });

    return adoptions.map((adoption) => AdoptionMapper.toDomain(adoption));
  }

  public async save(adoption: Adoption): Promise<Adoption> {
    await DatabaseConnection.query.adoption.update({
      where: {
        id: adoption.id.toValue(),
      },
      data: AdoptionMapper.toPersistence(adoption),
    });

    return adoption;
  }

  public async findByCode(code: string): Promise<Adoption | null> {
    const adoption = await DatabaseConnection.query.adoption.findUnique({
      where: {
        adoption_code: code,
      },
    });

    if (!adoption) return null;

    return AdoptionMapper.toDomain(adoption);
  }
}
