import { InMemoryOrganizationRepository } from "test/repository/in-memory-organization-repository";
import { makeOrganizationEntity } from "test/factories/make-organization";
import { makeOrganizationAddressEntity } from "test/factories/make-organization-address";
import { InMemoryOrganizationAddressRepository } from "test/repository/in-memory-organization-address-repository";

import { CompleteOrganizationProfile } from "../use-cases/complete-organization-profile";

import { OnOrganizationAddressCreated } from "./on-organization-address-created";

let inMemoryOrganizationRepository: InMemoryOrganizationRepository;
let inMemoryOrganizationAddressRepository: InMemoryOrganizationAddressRepository;
let completeOrganizationProfile: CompleteOrganizationProfile;

describe("On organization address created", () => {
  beforeEach(() => {
    inMemoryOrganizationRepository = new InMemoryOrganizationRepository();
    inMemoryOrganizationAddressRepository = new InMemoryOrganizationAddressRepository();
    completeOrganizationProfile = new CompleteOrganizationProfile(inMemoryOrganizationRepository);

    new OnOrganizationAddressCreated(completeOrganizationProfile);
  });

  it("should set the organization profile to true", async () => {
    const organization = await makeOrganizationEntity();
    const organizationAddress = makeOrganizationAddressEntity({
      organizationId: organization.id,
    });
    await inMemoryOrganizationRepository.create(organization);

    const sut = vi.spyOn(completeOrganizationProfile, "execute");

    expect(sut).not.toHaveBeenCalled();

    await inMemoryOrganizationAddressRepository.create(organizationAddress);

    expect(sut).toHaveBeenCalledTimes(1);
  });
});
