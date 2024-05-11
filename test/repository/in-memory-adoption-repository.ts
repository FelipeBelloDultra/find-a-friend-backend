import { AdoptionRepository } from "~/domain/adoption/application/repository/adoption-repository";
import { Adoption } from "~/domain/adoption/enterprise/entities/adoption";

export class InMemoryAdoptionRepository implements AdoptionRepository {
  public readonly adoptions: Array<Adoption> = [];

  async create(adoption: Adoption): Promise<Adoption> {
    this.adoptions.push(adoption);

    return adoption;
  }
}
