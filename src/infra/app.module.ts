import { Module } from "@nestjs/common";
import { ThrottlerModule } from "@nestjs/throttler";

import { HttpModule } from "./http/http.module";

@Module({
  imports: [
    HttpModule,
    ThrottlerModule.forRoot([
      {
        ttl: 1000 * 60 * 1, // milliseconds * seconds * minutes,
        limit: 100,
      },
    ]),
  ],
})
export class AppModule {}
