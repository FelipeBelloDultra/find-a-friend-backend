import { PetAdoptionStatusValue } from "~/domain/pet/enterprise/entities/value-object/adoption-status";
import { PetEnergyLevel, PetEnvironmentSize, PetSize } from "~/domain/pet/enterprise/entities/pet";

export interface FetchManyPetsQuery {
  id: string;
  organization_address_id: string;
  name: string;
  about: string;
  energy_level: PetEnergyLevel;
  environment_size: PetEnvironmentSize;
  size: PetSize;
  adoption_status: PetAdoptionStatusValue;
  created_at: Date;
  updated_at: Date;
  organization_id: string;
}
