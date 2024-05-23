import type { PaginationRepository } from "~/application/repository/pagination-repository";
import type {
  AdoptionRepository,
  FindAllAdoptionsFilters,
} from "~/domain/adoption/application/repository/adoption-repository";
import type { Adoption } from "~/domain/adoption/enterprise/entities/adoption";

export class InMemoryAdoptionRepository implements AdoptionRepository {
  public readonly adoptions: Array<Adoption> = [];

  public async create(adoption: Adoption): Promise<Adoption> {
    this.adoptions.push(adoption);

    return adoption;
  }

  public async findAll(
    { organizationId }: FindAllAdoptionsFilters,
    { limit, page }: PaginationRepository,
  ): Promise<Array<Adoption>> {
    const adoptions = this.adoptions.filter((adoption) => adoption.values.organizationId.toValue() === organizationId);

    const SKIP = (page - 1) * limit;
    const TAKE = page * limit;

    return adoptions.slice(SKIP, TAKE);
  }

  public async save(adoption: Adoption): Promise<Adoption> {
    const adoptionIndex = this.adoptions.findIndex(({ id }) => adoption.id.equals(id));

    if (adoptionIndex !== -1) {
      this.adoptions[adoptionIndex] = adoption;
    }

    return adoption;
  }

  public async findByCode(code: string): Promise<Adoption | null> {
    const adoption = this.adoptions.find((adoption) => adoption.values.adoptionCode.toValue() === code);

    if (!adoption) return null;

    return adoption;
  }
}
