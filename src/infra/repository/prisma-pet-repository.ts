import { DatabaseConnection } from "~/infra/database/connection";
import { PetMapper } from "~/domain/pet/application/mappers/pet-mapper";

import type { Pet } from "~/domain/pet/enterprise/entities/pet";
import type { PaginationRepository } from "~/application/repository/pagination-repository";
import type { FindAllPetsFilters, PetRepository } from "~/domain/pet/application/repository/pet-repository";

export class PrismaPetRepository implements PetRepository {
  public async create(pet: Pet): Promise<Pet> {
    await DatabaseConnection.query.pet.create({
      data: PetMapper.toPersistence(pet),
    });

    return pet;
  }

  public async findById(id: string): Promise<Pet | null> {
    const pet = await DatabaseConnection.query.pet.findUnique({
      where: {
        id,
      },
    });

    if (!pet) return null;

    return PetMapper.toDomain(pet);
  }

  public async save(pet: Pet): Promise<Pet> {
    await DatabaseConnection.query.pet.update({
      where: {
        id: pet.id.toValue(),
      },
      data: PetMapper.toPersistence(pet),
    });

    return pet;
  }

  public async findAll(filters: FindAllPetsFilters, { limit, page }: PaginationRepository): Promise<Array<Pet>> {
    const SKIP = (page - 1) * limit;
    const TAKE = page * limit;

    const pet = await DatabaseConnection.query.pet.findMany({
      take: TAKE,
      skip: SKIP,
      orderBy: [
        {
          created_at: "desc",
        },
      ],
      where: {
        ...filters,
      },
    });

    return pet.map((databasePet) => PetMapper.toDomain(databasePet));
  }
}
