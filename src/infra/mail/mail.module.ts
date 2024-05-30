import { join } from "node:path";

import { Module } from "@nestjs/common";
import { MailerModule } from "@nestjs-modules/mailer";
import { HandlebarsAdapter } from "@nestjs-modules/mailer/dist/adapters/handlebars.adapter";

import { env } from "~/config/env";
import { SendAdoptionCodeMail } from "~/domain/adoption/application/mail/send-adoption-code-mail";

import { SendAdoptionCodeMailService } from "./send-adoption-code-mail.service";

@Module({
  imports: [
    MailerModule.forRoot({
      template: {
        dir: join(__dirname, "templates"),
        adapter: new HandlebarsAdapter(),
        options: {
          strict: true,
        },
      },
      transport: {
        host: env.MAIL_HOST,
        port: env.MAIL_PORT,
        secure: false,
        auth: {
          user: env.MAIL_USERNAME,
          pass: env.MAIL_PASSWORD,
        },
        tls: {
          rejectUnauthorized: false,
        },
      },
    }),
  ],
  providers: [
    {
      provide: SendAdoptionCodeMail,
      useClass: SendAdoptionCodeMailService,
    },
  ],
})
export class MailModule {}
