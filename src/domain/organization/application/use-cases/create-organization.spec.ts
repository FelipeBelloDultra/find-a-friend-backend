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
    const org = await makeOrganization();

    const result = await sut.execute({
      email: org.email,
      logoUrl: org.logoUrl,
      name: org.name,
      password: "password",
      phone: org.phone,
    });

    expect(result.isRight()).toBe(true);
    expect(inMemoryOrganizationRepository.organizations[0].email).toEqual(
      org.email
    );
    expect(inMemoryOrganizationRepository.organizations[0].address).toBeNull();
  });

  it("should not create a new organization if email already exists", async () => {
    const orgData = await makeOrganization();
    const createdOrg = await inMemoryOrganizationRepository.create(
      await makeOrganizationEntity()
    );

    const result = await sut.execute({
      ...orgData,
      password: "password",
      email: createdOrg.email,
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(OrganizationAlreadyExists);
  });

  it("should create a new organization with password hashed", async () => {
    const org = await makeOrganization();
    const PASSWORD = "password";

    await sut.execute({
      email: org.email,
      logoUrl: org.logoUrl,
      name: org.name,
      password: PASSWORD,
      phone: org.phone,
    });

    expect(
      inMemoryOrganizationRepository.organizations[0].password
    ).not.toEqual(PASSWORD);
  });
});
