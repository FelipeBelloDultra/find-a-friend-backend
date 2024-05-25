import type { PetAdoptionStatus } from "@prisma/client";

export interface FetchManyAdoptionsQuery {
  id: string;
  adopter_email: string;
  adopter_name: string;
  adopter_phone: string;
  created_at: Date;
  expires_at: Date;
  confirmed_at: Date | null;
  Pet: {
    id: string;
    name: string;
    adoption_status: PetAdoptionStatus | string;
    updated_at: Date;
  };
}
