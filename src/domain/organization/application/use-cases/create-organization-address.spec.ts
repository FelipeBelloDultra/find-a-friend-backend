import { CreateOrganizationAddress } from "./create-organization-address";

import {
  makeOrganization,
  makeOrganizationEntity,
} from "test/factories/make-organization";
import { makeAddress } from "test/factories/make-address";
import { InMemoryOrganizationRepository } from "test/repository/in-memory-organization-repository";
import { InMemoryOrganizationAddressRepository } from "test/repository/in-memory-organization-address-repository";

import { OrganizationNotFound } from "./errors/organization-not-found";

let sut: CreateOrganizationAddress;
let inMemoryOrganizationRepository: InMemoryOrganizationRepository;
let inMemoryOrganizationAddressRepository: InMemoryOrganizationAddressRepository;

describe("Create organization address", () => {
  beforeEach(() => {
    inMemoryOrganizationRepository = new InMemoryOrganizationRepository();
    inMemoryOrganizationAddressRepository =
      new InMemoryOrganizationAddressRepository();
    sut = new CreateOrganizationAddress(
      inMemoryOrganizationAddressRepository,
      inMemoryOrganizationRepository
    );
  });

  it("should create organization address", async () => {
    const org = await inMemoryOrganizationRepository.create(
      await makeOrganizationEntity()
    );

    const result = await sut.execute({
      ...makeAddress(),
      organizationId: org.id.toValue(),
    });

    expect(result.isRight()).toBeTruthy();
    expect(
      inMemoryOrganizationAddressRepository.addresses[0].id.equals(org.id)
    );
  });

  it("should not create organization address if organization no exists", async () => {
    const result = await sut.execute({
      ...makeAddress(),
      organizationId: "fake-id",
    });

    expect(result.isLeft()).toBeTruthy();
    expect(result.value).toBeInstanceOf(OrganizationNotFound);
  });
});
