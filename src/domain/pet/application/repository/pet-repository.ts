import { PaginationRepository } from "~/core/repository/pagination-repository";
import { Pet } from "~/domain/pet/enterprise/entities/pet";

export interface FindAllPetsFilters {
  city: string;
  size?: "SMALL" | "MEDIUM" | "LARGE";
  energyLevel?: "LOW" | "MODERATE" | "MEDIUM" | "HIGH";
  environment?: "SMALL" | "MEDIUM" | "LARGE";
}

export interface PetRepository {
  create: (pet: Pet) => Promise<Pet>;
  findAll: (
    filters: FindAllPetsFilters,
    paginationParams: PaginationRepository
  ) => Promise<Array<Pet>>;
}
