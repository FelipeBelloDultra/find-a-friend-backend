import {
  SendAdoptionCodeMail,
  SendAdoptionCodeMailData,
} from "~/domain/adoption/application/mail/send-adoption-code-mail";

export class FakeSendAdoptionCodeMail implements SendAdoptionCodeMail {
  public readonly mails: Array<SendAdoptionCodeMailData> = [];

  public async send(data: SendAdoptionCodeMailData): Promise<void> {
    this.mails.push(data);
  }
}
