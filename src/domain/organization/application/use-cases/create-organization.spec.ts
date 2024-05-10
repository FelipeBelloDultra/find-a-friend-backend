import { CreateOrganization } from "./create-organization";

import {
  makeOrganization,
  makeOrganizationEntity,
} from "test/factories/make-organization";
import { InMemoryOrganizationRepository } from "test/repository/in-memory-organization-repository";

import { OrganizationAlreadyExists } from "./errors/organization-already-exists";

let sut: CreateOrganization;
let inMemoryOrganizationRepository: InMemoryOrganizationRepository;

describe("Create organization", () => {
  beforeEach(() => {
    inMemoryOrganizationRepository = new InMemoryOrganizationRepository();
    sut = new CreateOrganization(inMemoryOrganizationRepository);
  });

  it("should create a new organization", async () => {
    const org = makeOrganization();

    const result = await sut.execute({
      email: org.email,
      logoUrl: org.logoUrl,
      name: org.name,
      password: org.password,
      phone: org.phone,
    });

    expect(result.isRight()).toBe(true);
    expect(inMemoryOrganizationRepository.organizations[0].email).toEqual(
      org.email
    );
  });

  it("should not create a new organization if email already exists", async () => {
    const org = await inMemoryOrganizationRepository.create(
      makeOrganizationEntity()
    );

    const result = await sut.execute({
      ...makeOrganization(),
      email: org.email,
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(OrganizationAlreadyExists);
  });

  it("should create a new organization with password hashed", async () => {
    const org = makeOrganization();

    await sut.execute({
      email: org.email,
      logoUrl: org.logoUrl,
      name: org.name,
      password: org.password,
      phone: org.phone,
    });

    expect(
      inMemoryOrganizationRepository.organizations[0].password
    ).not.toEqual(org.password);
  });
});
