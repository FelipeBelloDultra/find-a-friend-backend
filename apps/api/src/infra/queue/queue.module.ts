import { BullModule } from "@nestjs/bull";
import { Module } from "@nestjs/common";

import { env } from "~/config/env";
import { SendVerificationCode } from "~/domain/adoption/application/jobs/send-verification-code";
import { SendAdoptionVerificationCode } from "~/domain/adoption/application/use-cases/send-adoption-verification-code";

import { MailModule } from "../mail/mail.module";

import { SendVerificationCodeConsumer } from "./adoption/send-verification-code/consumer";
import { SendVerificationCodeService } from "./adoption/send-verification-code/service";
import { ADOPTION_JOBS } from "./adoption/constants";

@Module({
  imports: [
    MailModule,
    BullModule.forRoot({
      redis: {
        host: env.REDIS_HOST,
        port: env.REDIS_PORT,
      },
    }),
    BullModule.registerQueue({
      name: ADOPTION_JOBS.SendVerificationCode,
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
  exports: [SendVerificationCode],
})
export class QueueModule {}
