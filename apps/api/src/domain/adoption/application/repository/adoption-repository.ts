import { PaginationRepository } from "~/application/repository/pagination-repository";
import { Adoption } from "~/domain/adoption/enterprise/entities/adoption";

import { FetchManyAdoptionsQuery } from "../query/queries";

export interface FindAllAdoptionsFilters {
  organizationId: string;
}
export abstract class AdoptionRepository {
  public abstract create: (adoption: Adoption) => Promise<Adoption>;
  public abstract findAll: (
    filters: FindAllAdoptionsFilters,
    paginationParams: PaginationRepository,
  ) => Promise<Array<FetchManyAdoptionsQuery>>;
  public abstract save: (adoption: Adoption) => Promise<Adoption>;
  public abstract findByCode: (code: string) => Promise<Adoption | null>;
}
