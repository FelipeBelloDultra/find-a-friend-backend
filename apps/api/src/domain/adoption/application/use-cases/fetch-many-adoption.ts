import { Either, right } from "~/core/either";
import { AdoptionRepository } from "~/domain/adoption/application/repository/adoption-repository";

import { FetchManyAdoptionsQuery } from "../query/queries";

interface FetchManyAdoptionInput {
  organizationId: string;
  page: number;
  limit: number;
}

type FetchManyAdoptionOutput = Either<never, { adoptions: Array<FetchManyAdoptionsQuery> }>;

export class FetchManyAdoption {
  public constructor(private readonly adoptionRepository: AdoptionRepository) {}

  public async execute(input: FetchManyAdoptionInput): Promise<FetchManyAdoptionOutput> {
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
