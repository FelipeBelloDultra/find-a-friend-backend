import { PrismaPetRepository } from "~/infra/repository/prisma-pet-repository";

import { FetchManyPets } from "../fetch-many-pets";

export function makeFetchManyPets() {
  const prismaPetsRepository = new PrismaPetRepository();

  return new FetchManyPets(prismaPetsRepository);
}
