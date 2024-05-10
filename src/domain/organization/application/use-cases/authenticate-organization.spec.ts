import { AuthenticateOrganization } from "./authenticate-organization";

import {
  makeOrganization,
  makeOrganizationEntity,
} from "test/factories/make-organization";
import { InMemoryOrganizationRepository } from "test/repository/in-memory-organization-repository";

import { InvalidCredentials } from "~/core/errors/invalid-credentials";
import { Password } from "../../enterprise/entities/value-object/password";

let sut: AuthenticateOrganization;
let inMemoryOrganizationRepository: InMemoryOrganizationRepository;

describe("Authenticate organization", () => {
  beforeEach(() => {
    inMemoryOrganizationRepository = new InMemoryOrganizationRepository();
    sut = new AuthenticateOrganization(inMemoryOrganizationRepository);
  });

  it("should authenticate the organization", async () => {
    const PASSWORD = "password";
    const EMAIL = "email@example.com";
    await inMemoryOrganizationRepository.create(
      await makeOrganizationEntity({
        password: await Password.create(PASSWORD),
        email: EMAIL,
      })
    );

    const result = await sut.execute({
      email: EMAIL,
      password: PASSWORD,
    });

    expect(result.isRight()).toBeTruthy();
    expect(result.value).contains({
      email: EMAIL,
      id: inMemoryOrganizationRepository.organizations[0].id.toValue(),
    });
  });

  it("should not be able to authenticate the organization if organization does not exist", async () => {
    const PASSWORD = "password";
    const EMAIL = "email@example.com";

    const result = await sut.execute({
      email: EMAIL,
      password: PASSWORD,
    });

    expect(result.isLeft()).toBeTruthy();
    expect(result.value).toBeInstanceOf(InvalidCredentials);
  });

  it("should not be able to authenticate the organization if password does not match", async () => {
    const PASSWORD = "password";
    const EMAIL = "email@example.com";
    await inMemoryOrganizationRepository.create(
      await makeOrganizationEntity({
        password: await Password.create(PASSWORD),
        email: EMAIL,
      })
    );

    const result = await sut.execute({
      email: EMAIL,
      password: "wrong-password",
    });

    expect(result.isLeft()).toBeTruthy();
    expect(result.value).toBeInstanceOf(InvalidCredentials);
  });
});
