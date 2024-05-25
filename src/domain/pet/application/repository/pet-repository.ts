import type { FetchManyPetsQuery } from "../query/queries";
import type { PaginationRepository } from "~/application/repository/pagination-repository";
import type { Pet } from "~/domain/pet/enterprise/entities/pet";

export interface FindAllPetsFilters {
  city?: string;
  size?: "SMALL" | "MEDIUM" | "LARGE";
  energyLevel?: "LOW" | "MODERATE" | "MEDIUM" | "HIGH";
  environment?: "SMALL" | "MEDIUM" | "LARGE";
  adoptionStatus?: "PENDING" | "ADOPTED" | "NOT_ADOPTED";
  organizationId?: string;
  organizationAddressId?: string;
}

export interface PetRepository {
  create: (pet: Pet) => Promise<Pet>;
  findById: (id: string) => Promise<Pet | null>;
  save: (pet: Pet) => Promise<Pet>;
  findAll: (filters: FindAllPetsFilters, paginationParams: PaginationRepository) => Promise<Array<FetchManyPetsQuery>>;
}
