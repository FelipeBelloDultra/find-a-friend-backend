import { Password } from "./password";

describe("Password", () => {
  it("should create hashed password", async () => {
    const PASSWORD = "password";

    const sut = await Password.create(PASSWORD);

    expect(sut.value).not.toEqual(PASSWORD);
  });

  it("should compare the password", async () => {
    const PASSWORD = "password";

    const sut = await Password.create(PASSWORD);

    await expect(sut.comparePassword(PASSWORD)).resolves.toBeTruthy();
    await expect(sut.comparePassword("wrong-password")).resolves.toBeFalsy();
  });

  it("should use an plain password on create instance if isHashed param is provided", async () => {
    const PASSWORD = "password";

    const sut = await Password.create(PASSWORD, true);

    expect(sut.value).toEqual(PASSWORD);
  });
});
