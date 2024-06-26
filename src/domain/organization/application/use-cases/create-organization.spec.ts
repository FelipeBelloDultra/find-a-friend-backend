import { makeOrganization, makeOrganizationEntity } from "test/factories/make-organization";
import { InMemoryOrganizationRepository } from "test/repository/in-memory-organization-repository";

import { CreateOrganization } from "./create-organization";
import { OrganizationAlreadyExists } from "./errors/organization-already-exists";

describe("Create organization", () => {
  let sut: CreateOrganization;
  let inMemoryOrganizationRepository: InMemoryOrganizationRepository;

  beforeEach(() => {
    inMemoryOrganizationRepository = new InMemoryOrganizationRepository();
    sut = new CreateOrganization(inMemoryOrganizationRepository);
  });

  it("should create a new organization", async () => {
    const org = await makeOrganization();

    const result = await sut.execute({
      email: org.email,
      name: org.name,
      password: "password",
      phone: org.phone,
    });

    expect(result.isRight()).toBe(true);
    expect(inMemoryOrganizationRepository.organizations[0].values.email).toEqual(org.email);
  });

  it("should not create a new organization if email already exists", async () => {
    const orgData = await makeOrganization();
    const createdOrg = await inMemoryOrganizationRepository.create(await makeOrganizationEntity());

    const result = await sut.execute({
      ...orgData,
      password: "password",
      email: createdOrg.values.email,
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(OrganizationAlreadyExists);
  });

  it("should create a new organization with password hashed", async () => {
    const org = await makeOrganization();
    const PASSWORD = "password";

    await sut.execute({
      email: org.email,
      name: org.name,
      password: PASSWORD,
      phone: org.phone,
    });

    expect(inMemoryOrganizationRepository.organizations[0].values.password).not.toEqual(PASSWORD);
  });
});
