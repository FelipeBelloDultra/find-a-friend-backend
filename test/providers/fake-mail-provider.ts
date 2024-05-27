import { MailProvider, SendAdoptionCodeMailData, SendMailData } from "~/application/providers/mail/mail-provider";

export class FakeMailProvider implements MailProvider {
  public async sendMail(_: SendMailData): Promise<void> {}

  public async sendAdoptionCodeMail(_: SendAdoptionCodeMailData): Promise<void> {}
}
