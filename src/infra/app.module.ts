import { Module } from "@nestjs/common";
import { ThrottlerModule } from "@nestjs/throttler";
import { MailerModule } from "@nestjs-modules/mailer";

import { HttpModule } from "./http/http.module";
import { AuthModule } from "./auth/auth.module";
import { QueueModule } from "./queue/queue.module";

@Module({
  imports: [
    ThrottlerModule.forRoot([
      {
        ttl: 1000 * 60 * 1, // milliseconds * seconds * minutes,
        limit: 100,
      },
    ]),
    MailerModule,
    QueueModule,
    AuthModule,
    HttpModule,
  ],
})
export class AppModule {
  public test() {
    console.log(this);
  }
}
