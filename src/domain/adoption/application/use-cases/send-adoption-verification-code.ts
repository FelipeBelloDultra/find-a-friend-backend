import { right } from "~/core/either";

import { ExpiresAt } from "../../enterprise/entities/value-object/expires-at";

import type { MailProvider } from "~/application/providers/mail/mail-provider";
import type { UseCase } from "~/application/use-case";
import type { Either } from "~/core/either";

interface SendAdoptionVerificationCodeInput {
  petName: string;
  adopterName: string;
  adopterEmail: string;
  adoptionCode: string;
  codeExpiresAt: number;
}
type OnLeft = never;
type OnRight = void;

type SendAdoptionVerificationCodeOutput = Promise<Either<OnLeft, OnRight>>;

export class SendAdoptionVerificationCode
  implements UseCase<SendAdoptionVerificationCodeInput, SendAdoptionVerificationCodeOutput>
{
  public constructor(private readonly mailProvider: MailProvider) {}

  public async execute(input: SendAdoptionVerificationCodeInput): SendAdoptionVerificationCodeOutput {
    await this.mailProvider.sendAdoptionCodeMail({
      petName: input.petName,
      confirmationLink: input.adoptionCode, // TODO: insert link (create) here
      adopterEmail: input.adopterEmail,
      adopterName: input.adopterName,
      codeExpiresAt: ExpiresAt.EXPIRATION_IN_MINUTES,
    });

    return right(void 0);
  }
}
