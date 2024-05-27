import { SendAdoptionVerificationCode } from "~/domain/adoption/application/use-cases/send-adoption-verification-code";
import { QueueJob } from "~/application/providers/queue/queue-provider";
import { MailProvider } from "~/application/providers/mail/mail-provider";

import { BullQueueProvider } from "../bullmq-queue-provider";

const JOB_NAME = "send-adoption-verification-code";

export class SendAdoptionVerificationCodeJob extends BullQueueProvider implements QueueJob {
  private readonly sendAdoptionVerificationCode: SendAdoptionVerificationCode;

  public constructor(mailProvider: MailProvider) {
    super(JOB_NAME);
    process.stdout.write(`[JOB]: Listen to ${JOB_NAME}\n`);
    this.sendAdoptionVerificationCode = new SendAdoptionVerificationCode(mailProvider);
  }

  public listen() {
    this.process<{
      petName: string;
      adopterName: string;
      adopterEmail: string;
      adoptionCode: string;
      codeExpiresAt: number;
    }>(async ({ data }) => {
      await this.sendAdoptionVerificationCode.execute(data);
    });
  }
}
