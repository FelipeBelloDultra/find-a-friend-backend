import { PaginationRepository } from "~/core/repository/pagination-repository";
import { Pet } from "~/domain/pet/enterprise/entities/pet";

export interface FindAllPetsParams {
  city: string;
}

export interface PetRepository {
  create: (pet: Pet) => Promise<Pet>;
  findAll: (
    params: FindAllPetsParams,
    paginationParams: PaginationRepository
  ) => Promise<Array<Pet>>;
}
