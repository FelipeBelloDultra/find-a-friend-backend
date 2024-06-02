import { Controller, Get, HttpCode, Query, Req } from "@nestjs/common";
import { z } from "zod";
import { Request } from "express";

import { FetchManyPetsAvailableToAdoption } from "~/domain/pet/application/use-cases/fetch-many-pets-available-to-adoption";
import { Public } from "~/infra/auth/public";

import { ZodValidationPipe } from "../../pipes/zod-validation-pipe";
import { HttpPresenter } from "../../presenters/http-presenter";

const queriesParamSchema = z.object({
  page: z.string().optional().default("1").transform(Number).pipe(z.number().min(1)),
  limit: z.string().optional().default("10").transform(Number).pipe(z.number().min(10)),
  city: z.string(),
  state: z.string(),
  environment: z.enum(["MEDIUM", "SMALL", "LARGE"]).optional(),
  energy_level: z.enum(["LOW", "MODERATE", "MEDIUM", "HIGH"]).optional(),
  size: z.enum(["MEDIUM", "SMALL", "LARGE"]).optional(),
});

const queriesValidationPipe = new ZodValidationPipe(queriesParamSchema);

type QueriesParamSchema = z.infer<typeof queriesParamSchema>;

@Controller("/pets")
@Public()
export class FetchManyPetsAvailableToAdoptionController {
  public constructor(private readonly fetchManyPetsAvailableToAdoption: FetchManyPetsAvailableToAdoption) {}

  @Get()
  @HttpCode(200)
  public async handle(@Req() req: Request, @Query(queriesValidationPipe) query: QueriesParamSchema) {
    const { city, size, energy_level, environment, limit, page, state } = query;

    const result = await this.fetchManyPetsAvailableToAdoption.execute({
      city,
      limit,
      page,
      state,
      size,
      energyLevel: energy_level,
      environment,
    });

    return HttpPresenter.success(result.value);
  }
}
