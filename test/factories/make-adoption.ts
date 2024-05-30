import { faker } from "@faker-js/faker";
import { Injectable } from "@nestjs/common";

import { UniqueEntityID } from "~/core/entity/unique-entity-id";
import { Adoption, AdoptionProps } from "~/domain/adoption/enterprise/entities/adoption";
import { ExpiresAt } from "~/domain/adoption/enterprise/entities/value-object/expires-at";
import { AdoptionMapper } from "~/infra/database/prisma/mappers/adoption-mapper";
import { PrismaService } from "~/infra/database/prisma/prisma.service";

export function makeAdoption() {
  return {
    petId: new UniqueEntityID(),
    organizationId: new UniqueEntityID(),
    adopterEmail: faker.internet.email(),
    adopterName: faker.person.fullName(),
    adopterPhone: faker.phone.number(),
    expiresAt: ExpiresAt.create(),
  };
}

export function makeAdoptionEntity(override: Partial<AdoptionProps> = {}, id?: UniqueEntityID) {
  const adoption = Adoption.create(
    {
      ...makeAdoption(),
      ...override,
    },
    id,
  );

  return adoption;
}

@Injectable()
export class AdoptionFactory {
  public constructor(private prisma: PrismaService) {}

  public async makePrismaAdoption(data: Partial<AdoptionProps> = {}): Promise<Adoption> {
    const adoption = await makeAdoptionEntity(data);

    await this.prisma.adoption.create({
      data: AdoptionMapper.toPersistence(adoption),
    });

    return adoption;
  }
}
