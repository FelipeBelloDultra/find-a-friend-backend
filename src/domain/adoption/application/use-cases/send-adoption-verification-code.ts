import { Injectable } from "@nestjs/common";

import { Either, right } from "~/core/either";
import { env } from "~/config/env";
import { UseCase } from "~/application/use-case";

import { SendAdoptionCodeMail } from "../mail/send-adoption-code-mail";
import { ExpiresAt } from "../../enterprise/entities/value-object/expires-at";

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
  public constructor(private readonly sendAdoptionCodeMail: SendAdoptionCodeMail) {}

  public async execute(input: SendAdoptionVerificationCodeInput): SendAdoptionVerificationCodeOutput {
    const link = `${env.FRONTEND_URL}/auth/adoption/${input.adoptionCode}/confirmation`;

    await this.sendAdoptionCodeMail.send({
      petName: input.petName,
      confirmationLink: link,
      adopterEmail: input.adopterEmail,
      adopterName: input.adopterName,
      codeExpiresAt: ExpiresAt.EXPIRATION_IN_MINUTES,
    });

    return right(void 0);
  }
}
