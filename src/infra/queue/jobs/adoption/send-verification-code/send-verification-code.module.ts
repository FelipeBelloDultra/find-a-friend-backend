import { BullModule } from "@nestjs/bull";
import { Module } from "@nestjs/common";

import { SendVerificationCode } from "~/domain/adoption/application/jobs/send-verification-code";
import { SendAdoptionVerificationCode } from "~/domain/adoption/application/use-cases/send-adoption-verification-code";

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
      provide: SendVerificationCode,
      useClass: SendVerificationCodeService,
    },
    SendAdoptionVerificationCode,
    SendVerificationCodeConsumer,
  ],
})
export class SendVerificationCodeModule {}
