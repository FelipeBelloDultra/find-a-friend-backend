import { PaginationRepository } from "~/application/repository/pagination-repository";
import { Adoption } from "~/domain/adoption/enterprise/entities/adoption";

export interface FindAllAdoptionsFilters {
  organizationId: string;
}
export interface AdoptionRepository {
  create: (adoption: Adoption) => Promise<Adoption>;
  findAll: (
    filters: FindAllAdoptionsFilters,
    paginationParams: PaginationRepository
  ) => Promise<Array<Adoption>>;
}
