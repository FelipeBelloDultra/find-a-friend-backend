import { UseCase } from "~/application/use-case";
import { Either, right } from "~/core/either";

import { AdoptionRepository } from "~/domain/adoption/application/repository/adoption-repository";
import { Adoption } from "~/domain/adoption/enterprise/entities/adoption";

interface FetchManyAdoptionInput {
  organizationId: string;
  page: number;
  limit: number;
}
type OnLeft = never;
type OnRight = { adoptions: Array<Adoption> };

type FetchManyAdoptionOutput = Promise<Either<OnLeft, OnRight>>;

export class FetchManyAdoption implements UseCase<FetchManyAdoptionInput, FetchManyAdoptionOutput> {
  constructor(private readonly adoptionRepository: AdoptionRepository) {}

  async execute(input: FetchManyAdoptionInput): FetchManyAdoptionOutput {
    const adoptions = await this.adoptionRepository.findAll(
      {
        organizationId: input.organizationId,
      },
      {
        limit: input.limit,
        page: input.page,
      },
    );

    return right({
      adoptions,
    });
  }
}
