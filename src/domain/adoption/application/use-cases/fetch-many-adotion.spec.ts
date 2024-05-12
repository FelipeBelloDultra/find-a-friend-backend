import { makeAdoptionEntity } from "test/factories/make-adoption";
import { InMemoryAdoptionRepository } from "test/repository/in-memory-adoption-repository";

import { FetchManyAdoption } from "./fetch-many-adotion";

let sut: FetchManyAdoption;
let inMemoryAdoptionRepository: InMemoryAdoptionRepository;

describe("Fetch many adoptions", () => {
  beforeEach(() => {
    inMemoryAdoptionRepository = new InMemoryAdoptionRepository();
    sut = new FetchManyAdoption(inMemoryAdoptionRepository);
  });

  it("should return all adoptions from organzation in first page", async () => {
    const adoption = makeAdoptionEntity();

    for (let i = 0; i < 11; i++) {
      await inMemoryAdoptionRepository.create(adoption);
    }

    const result = await sut.execute({
      organizationId: adoption.organizationId.toValue(),
      limit: 10,
      page: 1,
    });

    expect(result.isRight()).toBeTruthy();
    expect(result.value.adoptions.length).toBe(10);
  });

  it("should return all adoptions from organzation in second page", async () => {
    const adoption = makeAdoptionEntity();

    for (let i = 0; i < 12; i++) {
      await inMemoryAdoptionRepository.create(adoption);
    }

    const result = await sut.execute({
      organizationId: adoption.organizationId.toValue(),
      limit: 10,
      page: 2,
    });

    expect(result.isRight()).toBeTruthy();
    expect(result.value.adoptions.length).toBe(2);
  });
});
