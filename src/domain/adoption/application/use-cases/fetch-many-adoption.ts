import { Either, right } from "~/core/either";
import { AdoptionRepository } from "~/domain/adoption/application/repository/adoption-repository";
import { UseCase } from "~/application/use-case";

import { FetchManyAdoptionsQuery } from "../query/queries";

interface FetchManyAdoptionInput {
  organizationId: string;
  page: number;
  limit: number;
}
type OnLeft = never;
type OnRight = { adoptions: Array<FetchManyAdoptionsQuery> };

type FetchManyAdoptionOutput = Promise<Either<OnLeft, OnRight>>;

export class FetchManyAdoption implements UseCase<FetchManyAdoptionInput, FetchManyAdoptionOutput> {
  public constructor(private readonly adoptionRepository: AdoptionRepository) {}

  public async execute(input: FetchManyAdoptionInput): FetchManyAdoptionOutput {
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
