import { faker } from "@faker-js/faker";
import { Injectable } from "@nestjs/common";

import { Pet, PetProps } from "~/domain/pet/enterprise/entities/pet";
import { UniqueEntityID } from "~/core/entity/unique-entity-id";
import { AdoptionStatus } from "~/domain/pet/enterprise/entities/value-object/adoption-status";
import { PrismaService } from "~/infra/database/prisma/prisma.service";
import { PetMapper } from "~/infra/database/prisma/mappers/pet-mapper";

export function makePet() {
  return {
    organizationId: new UniqueEntityID(),
    organizationAddressId: new UniqueEntityID(),
    name: faker.animal.dog(),
    about: faker.lorem.text(),
    size: "LARGE",
    energyLevel: "HIGH",
    environmentSize: "SMALL",
    adoptionStatus: AdoptionStatus.create(),
  } as const;
}

export function makePetEntity(override: Partial<PetProps> = {}, id?: UniqueEntityID) {
  const pet = Pet.create(
    {
      ...makePet(),
      ...override,
    },
    id,
  );

  return pet;
}

@Injectable()
export class PetFactory {
  public constructor(private prisma: PrismaService) {}

  public async makePrismaPet(data: Partial<PetProps> = {}): Promise<Pet> {
    const pet = makePetEntity(data);

    await this.prisma.pet.create({
      data: PetMapper.toPersistence(pet),
    });

    return pet;
  }
}
