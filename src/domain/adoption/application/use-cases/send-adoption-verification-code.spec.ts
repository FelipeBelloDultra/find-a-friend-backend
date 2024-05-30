import { env } from "~/config/env";
import { FakeSendAdoptionCodeMail } from "test/mail/fake-send-adoption-code-mail";

import { ExpiresAt } from "../../enterprise/entities/value-object/expires-at";

import { SendAdoptionVerificationCode } from "./send-adoption-verification-code";

let fakeSendAdoptionCodeMail: FakeSendAdoptionCodeMail;
let sut: SendAdoptionVerificationCode;

describe("Send adoption verification code", () => {
  beforeEach(() => {
    fakeSendAdoptionCodeMail = new FakeSendAdoptionCodeMail();
    sut = new SendAdoptionVerificationCode(fakeSendAdoptionCodeMail);
  });

  it("should send the validation code", async () => {
    const spyMailProvider_send = vi.spyOn(fakeSendAdoptionCodeMail, "send");
    const code = "code-example";
    const link = `${env.FRONTEND_URL}/auth/adoption/${code}/confirmation`;

    await sut.execute({
      adopterEmail: "test@example.com",
      adopterName: "test",
      adoptionCode: code,
      codeExpiresAt: ExpiresAt.EXPIRATION_IN_MINUTES,
      petName: "test",
    });

    expect(spyMailProvider_send).toHaveBeenCalledTimes(1);
    expect(spyMailProvider_send).toHaveBeenCalledWith(
      expect.objectContaining({
        confirmationLink: link,
      }),
    );
  });
});
