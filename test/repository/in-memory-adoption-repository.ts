import { type PaginationRepository } from "~/application/repository/pagination-repository";
import {
  type AdoptionRepository,
  type FindAllAdoptionsFilters,
} from "~/domain/adoption/application/repository/adoption-repository";
import { type Adoption } from "~/domain/adoption/enterprise/entities/adoption";

export class InMemoryAdoptionRepository implements AdoptionRepository {
  public readonly adoptions: Array<Adoption> = [];

  async create(adoption: Adoption): Promise<Adoption> {
    this.adoptions.push(adoption);

    return adoption;
  }

  async findAll(
    { organizationId }: FindAllAdoptionsFilters,
    { limit, page }: PaginationRepository,
  ): Promise<Array<Adoption>> {
    const adoptions = this.adoptions.filter((adoption) => adoption.organizationId.toValue() === organizationId);

    const SKIP = (page - 1) * limit;
    const TAKE = page * limit;

    return adoptions.slice(SKIP, TAKE);
  }
}
