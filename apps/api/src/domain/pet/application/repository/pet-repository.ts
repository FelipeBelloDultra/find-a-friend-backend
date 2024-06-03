import { PetAdoptionStatusValue } from "~/domain/pet/enterprise/entities/value-object/adoption-status";
import { PaginationRepository } from "~/application/repository/pagination-repository";
import { Pet, PetEnergyLevel, PetEnvironmentSize, PetSize } from "~/domain/pet/enterprise/entities/pet";

import { FetchManyPetsQuery } from "../query/queries";

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
  ) => Promise<{ pets: Array<FetchManyPetsQuery>; total: number }>;
}
