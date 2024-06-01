import { Module } from "@nestjs/common";
import { ThrottlerModule } from "@nestjs/throttler";

import { HttpModule } from "./http/http.module";
import { AuthModule } from "./auth/auth.module";
import { EventsModule } from "./events/events.module";

@Module({
  imports: [
    ThrottlerModule.forRoot([
      {
        ttl: 1000 * 60 * 1, // milliseconds * seconds * minutes,
        limit: 100,
      },
    ]),
    AuthModule,
    HttpModule,
    EventsModule,
  ],
})
export class AppModule {}
