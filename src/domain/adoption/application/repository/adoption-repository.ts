import { Adoption } from "~/domain/adoption/enterprise/entities/adoption";

export interface AdoptionRepository {
  create: (adoption: Adoption) => Promise<Adoption>;
}
