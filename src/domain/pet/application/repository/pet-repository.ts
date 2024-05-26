import type { PetAdoptionStatusValue } from "~/domain/pet/enterprise/entities/value-object/adoption-status";
import type { FetchManyPetsQuery } from "../query/queries";
import type { PaginationRepository } from "~/application/repository/pagination-repository";
import type { Pet, PetEnergyLevel, PetEnvironmentSize, PetSize } from "~/domain/pet/enterprise/entities/pet";

export interface FindAllPetsFilters {
  city?: string;
  state?: string;
  size?: PetSize;
  energyLevel?: PetEnergyLevel;
  environment?: PetEnvironmentSize;
  adoptionStatus?: PetAdoptionStatusValue;
  organizationId?: string;
  organizationAddressId?: string;
}

export abstract class PetRepository {
  public abstract create: (pet: Pet) => Promise<Pet>;
  public abstract findById: (id: string) => Promise<Pet | null>;
  public abstract save: (pet: Pet) => Promise<Pet>;
  public abstract findAll: (
    filters: FindAllPetsFilters,
    paginationParams: PaginationRepository,
  ) => Promise<Array<FetchManyPetsQuery>>;
}
