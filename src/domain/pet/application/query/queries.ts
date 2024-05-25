export interface FetchManyPetsQuery {
  id: string;
  organization_address_id: string;
  name: string;
  about: string;
  energy_level: "LOW" | "MODERATE" | "MEDIUM" | "HIGH";
  environment_size: "MEDIUM" | "SMALL" | "LARGE";
  size: "MEDIUM" | "SMALL" | "LARGE";
  adoption_status: "NOT_ADOPTED" | "PENDING" | "ADOPTED";
  created_at: Date;
  updated_at: Date;
  organization_id: string;
}
