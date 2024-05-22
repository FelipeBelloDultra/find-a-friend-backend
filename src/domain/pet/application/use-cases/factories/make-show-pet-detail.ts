import { PrismaPetRepository } from "~/infra/repository/prisma-pet-repository";

import { ShowPetDetail } from "../show-pet-detail";

export function makeShowPetDetail() {
  const prismaPetRepository = new PrismaPetRepository();

  return new ShowPetDetail(prismaPetRepository);
}
