import { CreateOrganization } from "../create-organization";
import { InMemoryOrganizationRepository } from "test/repository/in-memory-organization-repository";

export function makeCreateOrganization() {
  const inMemoryOrganizationRepository = new InMemoryOrganizationRepository();

  return new CreateOrganization(inMemoryOrganizationRepository);
}
