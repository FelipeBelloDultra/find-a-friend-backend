import { makeOrganizationEntity } from "test/factories/make-organization";
import { InMemoryOrganizationRepository } from "test/repository/in-memory-organization-repository";
import { Password } from "~/domain/organization/enterprise/entities/value-object/password";
import { FakeEncrypter } from "test/cryptography/fake-encrypter";

import { InvalidCredentials } from "./errors/invalid-credentials";
import { AuthenticateOrganization } from "./authenticate-organization";

describe("Authenticate organization", () => {
  let sut: AuthenticateOrganization;
  let inMemoryOrganizationRepository: InMemoryOrganizationRepository;
  let fakeEncrypter: FakeEncrypter;

  beforeEach(() => {
    inMemoryOrganizationRepository = new InMemoryOrganizationRepository();
    fakeEncrypter = new FakeEncrypter();
    sut = new AuthenticateOrganization(inMemoryOrganizationRepository, fakeEncrypter);
  });

  it("should authenticate the organization", async () => {
    const PASSWORD = "password";
    const EMAIL = "email@example.com";
    await inMemoryOrganizationRepository.create(
      await makeOrganizationEntity({
        password: await Password.create(PASSWORD),
        email: EMAIL,
      }),
    );

    const result = await sut.execute({
      email: EMAIL,
      password: PASSWORD,
    });

    expect(result.isRight()).toBeTruthy();
    expect(result.value).toEqual(
      expect.objectContaining({
        accessToken: expect.any(String),
        refreshToken: expect.any(String),
      }),
    );
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
      }),
    );

    const result = await sut.execute({
      email: EMAIL,
      password: "wrong-password",
    });

    expect(result.isLeft()).toBeTruthy();
    expect(result.value).toBeInstanceOf(InvalidCredentials);
  });
});
