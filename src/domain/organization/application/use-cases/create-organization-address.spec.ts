import { makeOrganizationAddress } from "test/factories/make-organization-address";
import { InMemoryOrganizationAddressRepository } from "test/repository/in-memory-organization-address-repository";
import { InMemoryOrganizationRepository } from "test/repository/in-memory-organization-repository";
import { makeOrganizationEntity } from "test/factories/make-organization";

import { CreateOrganizationAddress } from "./create-organization-address";
import { OrganizationNotFound } from "./errors/organization-not-found";

describe("Create organization address", () => {
  let inMemoryOrganizationAddressRepository: InMemoryOrganizationAddressRepository;
  let inMemoryOrganizationRepository: InMemoryOrganizationRepository;
  let sut: CreateOrganizationAddress;

  beforeEach(() => {
    inMemoryOrganizationAddressRepository = new InMemoryOrganizationAddressRepository();
    inMemoryOrganizationRepository = new InMemoryOrganizationRepository();
    sut = new CreateOrganizationAddress(inMemoryOrganizationRepository, inMemoryOrganizationAddressRepository);
  });

  it("should be able to create a new organization address", async () => {
    const organization = await makeOrganizationEntity();
    await inMemoryOrganizationRepository.create(organization);
    const organizationAddress = makeOrganizationAddress();

    const result = await sut.execute({
      ...organizationAddress,
      organizationId: organization.id.toValue(),
    });

    expect(result.isRight()).toBe(true);
    expect(inMemoryOrganizationAddressRepository.organizationAddresses[0].values.organizationId).toEqual(
      organization.id,
    );
    expect(inMemoryOrganizationAddressRepository.organizationAddresses.length).toEqual(1);
  });

  it("should not be able to create a new organization address if organization does not exists", async () => {
    const organization = await makeOrganizationEntity();
    const organizationAddress = makeOrganizationAddress();

    const result = await sut.execute({
      ...organizationAddress,
      organizationId: organization.id.toValue(),
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(OrganizationNotFound);
  });
});
