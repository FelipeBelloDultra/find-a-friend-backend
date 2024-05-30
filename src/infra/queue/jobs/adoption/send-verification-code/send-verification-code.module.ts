import { BullModule } from "@nestjs/bull";
import { Module } from "@nestjs/common";

import { SendVerificationCode } from "~/domain/adoption/application/jobs/send-verification-code";
import { SendAdoptionVerificationCode } from "~/domain/adoption/application/use-cases/send-adoption-verification-code";
import { SendAdoptionCodeMail } from "~/domain/adoption/application/mail/send-adoption-code-mail";
import { SendAdoptionCodeMailService } from "~/infra/mail/send-adoption-code-mail.service";

import { SendVerificationCodeService } from "./send-verification-code.service";
import { SendVerificationCodeConsumer } from "./send-verification-code.consumer";

@Module({
  imports: [
    BullModule.registerQueue({
      name: "adoption.send-verification-code.job",
    }),
  ],
  providers: [
    {
      provide: SendAdoptionCodeMail,
      useClass: SendAdoptionCodeMailService,
    },
    {
      provide: SendVerificationCode,
      useClass: SendVerificationCodeService,
    },
    SendAdoptionVerificationCode,
    SendVerificationCodeConsumer,
  ],
})
export class SendVerificationCodeModule {}
