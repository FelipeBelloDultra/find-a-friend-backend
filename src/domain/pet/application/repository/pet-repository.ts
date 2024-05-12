import type { PaginationRepository } from "~/application/repository/pagination-repository";
import type { Pet } from "~/domain/pet/enterprise/entities/pet";

export interface FindAllPetsFilters {
  city: string;
  size?: "SMALL" | "MEDIUM" | "LARGE";
  energyLevel?: "LOW" | "MODERATE" | "MEDIUM" | "HIGH";
  environment?: "SMALL" | "MEDIUM" | "LARGE";
  adopted?: boolean;
}

export interface PetRepository {
  create: (pet: Pet) => Promise<Pet>;
  findById: (id: string) => Promise<Pet | null>;
  save: (pet: Pet) => Promise<Pet>;
  findAll: (filters: FindAllPetsFilters, paginationParams: PaginationRepository) => Promise<Array<Pet>>;
}
