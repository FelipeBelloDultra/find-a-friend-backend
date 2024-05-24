import { FakeMailProvider } from "test/providers/fake-mail-provider";
import { env } from "~/config/env";

import { ExpiresAt } from "../../enterprise/entities/value-object/expires-at";

import { SendAdoptionVerificationCode } from "./send-adoption-verification-code";

let fakeMailProvider: FakeMailProvider;
let sut: SendAdoptionVerificationCode;

describe("Send adoption verification code", () => {
  beforeEach(() => {
    fakeMailProvider = new FakeMailProvider();
    sut = new SendAdoptionVerificationCode(fakeMailProvider);
  });

  it("should send the validation code", async () => {
    const spyMailProvider_sendAdoptionVerificationCode = vi.spyOn(fakeMailProvider, "sendAdoptionCodeMail");
    const code = "code-example";
    const link = `${env.FRONTEND_URL}/auth/adoption/${code}/confirmation`;

    await sut.execute({
      adopterEmail: "test@example.com",
      adopterName: "test",
      adoptionCode: code,
      codeExpiresAt: ExpiresAt.EXPIRATION_IN_MINUTES,
      petName: "test",
    });

    expect(spyMailProvider_sendAdoptionVerificationCode).toHaveBeenCalledTimes(1);
    expect(spyMailProvider_sendAdoptionVerificationCode).toHaveBeenCalledWith(
      expect.objectContaining({
        confirmationLink: link,
      }),
    );
  });
});
