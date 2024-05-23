import { right } from "~/core/either";

import type { UseCase } from "~/application/use-case";
import type { Either } from "~/core/either";
import type { AdoptionRepository } from "~/domain/adoption/application/repository/adoption-repository";
import type { Adoption } from "~/domain/adoption/enterprise/entities/adoption";

interface VerifyAdoptionCodeInput {
  organizationId: string;
  page: number;
  limit: number;
}
type OnLeft = never;
type OnRight = { adoptions: Array<Adoption> };

type VerifyAdoptionCodeOutput = Promise<Either<OnLeft, OnRight>>;

export class VerifyAdoptionCode implements UseCase<VerifyAdoptionCodeInput, VerifyAdoptionCodeOutput> {
  public constructor(private readonly adoptionRepository: AdoptionRepository) {}

  public async execute(input: VerifyAdoptionCodeInput): VerifyAdoptionCodeOutput {}
}
