import { PrismaAdoptionRepository } from "~/infra/repository/prisma-adoption-repository";

import { FetchManyAdoption } from "../fetch-many-adoption";

export function makeFetchManyAdoption() {
  const prismaAdoptionRepository = new PrismaAdoptionRepository();

  return new FetchManyAdoption(prismaAdoptionRepository);
}
