import { ShowOrganizationProfile } from "./show-organization-profile";

import { OrganizationNotFound } from "~/core/errors/organization-not-found";
import { Right } from "~/core/either";

import { Organization } from "~/domain/organization/enterprise/entities/organization";

import { makeOrganizationEntity } from "test/factories/make-organization";
import { InMemoryOrganizationRepository } from "test/repository/in-memory-organization-repository";

let sut: ShowOrganizationProfile;
let inMemoryOrganizationRepository: InMemoryOrganizationRepository;

describe("Show organization profile", () => {
  beforeEach(() => {
    inMemoryOrganizationRepository = new InMemoryOrganizationRepository();
    sut = new ShowOrganizationProfile(inMemoryOrganizationRepository);
  });

  it("should be able to show the organization profile by id", async () => {
    const org = await makeOrganizationEntity();
    await inMemoryOrganizationRepository.create(org);

    const result = (await sut.execute({
      organizationId: org.id.toValue(),
    })) as Right<never, { organization: Organization }>;

    expect(result.isRight()).toBeTruthy();
    expect(result.value.organization.id.equals(org.id)).toBeTruthy();
  });

  it("should not be able to show the organization profile by id if org does not exists", async () => {
    const result = await sut.execute({
      organizationId: "invalid-id",
    });

    expect(result.isLeft()).toBeTruthy();
    expect(result.value).toBeInstanceOf(OrganizationNotFound);
  });
});
