import { InMemoryOrganizationRepository } from "test/repository/in-memory-organization-repository";
import { makeOrganizationEntity } from "test/factories/make-organization";

import { CompleteOrganizationProfile } from "./complete-organization-profile";

let inMemoryOrganizationRepository: InMemoryOrganizationRepository;
let sut: CompleteOrganizationProfile;

describe("Complete organization profile", () => {
  beforeEach(() => {
    inMemoryOrganizationRepository = new InMemoryOrganizationRepository();

    sut = new CompleteOrganizationProfile(inMemoryOrganizationRepository);
  });

  it("should change the organization profile status", async () => {
    const organization = await makeOrganizationEntity();
    await inMemoryOrganizationRepository.create(organization);

    const result = await sut.execute({ organizationId: organization.id.toValue() });

    expect(result.isRight()).toBe(true);
    expect(inMemoryOrganizationRepository.organizations[0].values.profileCompleted).toBeTruthy();
  });

  it("should not be able to change the organization profile status if the organization does not exist", async () => {
    const organization = await makeOrganizationEntity();
    await inMemoryOrganizationRepository.create(organization);

    const result = await sut.execute({ organizationId: "invalid-id" });

    expect(result.isRight()).toBe(true);
    expect(inMemoryOrganizationRepository.organizations[0].values.profileCompleted).toBeFalsy();
  });

  it("should not be able to change the organization profile if it was changed", async () => {
    const organization = await makeOrganizationEntity();
    await inMemoryOrganizationRepository.create(organization);
    inMemoryOrganizationRepository.organizations[0].values.profileCompleted = true;

    await sut.execute({ organizationId: organization.id.toValue() });

    const result = await sut.execute({ organizationId: organization.id.toValue() });

    expect(result.isRight()).toBe(true);
    expect(inMemoryOrganizationRepository.organizations[0].values.profileCompleted).toBeTruthy();
  });
});
