import { MailerService } from "@nestjs-modules/mailer";

import {
  SendAdoptionCodeMail,
  SendAdoptionCodeMailData,
} from "~/domain/adoption/application/mail/send-adoption-code-mail";

export class SendAdoptionCodeMailService implements SendAdoptionCodeMail {
  public constructor(private readonly mailerService: MailerService) {}

  public async send(data: SendAdoptionCodeMailData) {
    await this.mailerService.sendMail({
      to: data.adopterEmail,
      subject: `Welcome, ${data.adopterName}!`,
      html: "verify-adoption-code",
      context: {
        name: data.adopterName,
        petName: data.petName,
        link: data.confirmationLink,
        expiresInMinutes: data.codeExpiresAt,
      },
    });
  }
}
