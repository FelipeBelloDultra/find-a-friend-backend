import { Injectable } from "@nestjs/common";

import { Either, right } from "~/core/either";
import { env } from "~/config/env";
// import { MailProvider } from "~/application/providers/mail/mail-provider";
import { UseCase } from "~/application/use-case";

// import { ExpiresAt } from "../../enterprise/entities/value-object/expires-at";

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

@Injectable()
export class SendAdoptionVerificationCode
  implements UseCase<SendAdoptionVerificationCodeInput, SendAdoptionVerificationCodeOutput>
{
  public constructor() {} // private readonly mailProvider: MailProvider

  public async execute(input: SendAdoptionVerificationCodeInput): SendAdoptionVerificationCodeOutput {
    const link = `${env.FRONTEND_URL}/auth/adoption/${input.adoptionCode}/confirmation`;

    console.log(link);

    // await this.mailProvider.sendAdoptionCodeMail({
    //   petName: input.petName,
    //   confirmationLink: link,
    //   adopterEmail: input.adopterEmail,
    //   adopterName: input.adopterName,
    //   codeExpiresAt: ExpiresAt.EXPIRATION_IN_MINUTES,
    // });

    return right(void 0);
  }
}
