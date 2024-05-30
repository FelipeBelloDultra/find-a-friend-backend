import { BullModule } from "@nestjs/bull";
import { Module } from "@nestjs/common";

import { env } from "~/config/env";

import { SendVerificationCodeModule } from "./jobs/adoption/send-verification-code/send-verification-code.module";

@Module({
  imports: [
    BullModule.forRoot({
      redis: {
        host: env.REDIS_HOST,
        port: env.REDIS_PORT,
      },
    }),
    SendVerificationCodeModule,
  ],
})
export class QueueModule {}
