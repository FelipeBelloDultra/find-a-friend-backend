import { FetchManyAdoptionsQuery } from "~/domain/adoption/application/query/queries";
import { PaginationRepository } from "~/application/repository/pagination-repository";
import {
  AdoptionRepository,
  FindAllAdoptionsFilters,
} from "~/domain/adoption/application/repository/adoption-repository";
import { Adoption } from "~/domain/adoption/enterprise/entities/adoption";

export class InMemoryAdoptionRepository implements AdoptionRepository {
  public readonly adoptions: Array<Adoption> = [];

  public async create(adoption: Adoption): Promise<Adoption> {
    this.adoptions.push(adoption);

    return adoption;
  }

  public async findAll(
    { organizationId }: FindAllAdoptionsFilters,
    { limit, page }: PaginationRepository,
  ): Promise<Array<FetchManyAdoptionsQuery>> {
    const adoptions = this.adoptions
      .filter((adoption) => adoption.values.organizationId.toValue() === organizationId)
      .map((adoption) => ({
        id: adoption.id.toValue(),
        adopter_email: adoption.values.adopterEmail,
        adopter_name: adoption.values.adopterName,
        adopter_phone: adoption.values.adopterPhone,
        created_at: adoption.values.createdAt,
        expires_at: adoption.values.expiresAt.value,
        confirmed_at: adoption.values.confirmedAt || null,
        Pet: {
          adoption_status: "PENDING",
          id: "",
          name: "",
          updated_at: new Date(),
        },
      }));

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
