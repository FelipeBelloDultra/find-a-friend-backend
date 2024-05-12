import { UpdateOrganizationAddress } from "./update-organization-address";

import { InMemoryOrganizationRepository } from "test/repository/in-memory-organization-repository";
import { makeAddress, makeAddressEntity } from "test/factories/make-address";
import { makeOrganizationEntity } from "test/factories/make-organization";

import { OrganizationNotFound } from "./errors//organization-not-found";

let sut: UpdateOrganizationAddress;
let inMemoryOrganizationRepository: InMemoryOrganizationRepository;

describe("Update organziation address", () => {
  beforeEach(() => {
    inMemoryOrganizationRepository = new InMemoryOrganizationRepository();
    sut = new UpdateOrganizationAddress(inMemoryOrganizationRepository);
  });

  it("should be able to update the address from organization", async () => {
    const org = await makeOrganizationEntity();
    const address = makeAddress();
    const addressEntity = makeAddressEntity(address);
    await inMemoryOrganizationRepository.create(org);

    const result = await sut.execute({
      ...address,
      organizationId: org.id.toValue(),
    });

    expect(result.isRight()).toBeTruthy();
    expect(inMemoryOrganizationRepository.organizations.length).toBe(1);
    expect(inMemoryOrganizationRepository.organizations[0].address).toMatchObject(addressEntity);
  });

  it("should not be able to update the address if organization does not exists", async () => {
    const address = makeAddress();

    const result = await sut.execute({
      ...address,
      organizationId: "invalid-id",
    });

    expect(result.isLeft()).toBeTruthy();
    expect(result.value).toBeInstanceOf(OrganizationNotFound);
  });
});
