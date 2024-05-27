import { QueueJob } from "~/application/providers/queue/queue-provider";

import { NodemailerMailProvider } from "../providers/mail/nodemailer-mail-provider";
import { SendAdoptionVerificationCodeJob } from "../providers/queue/jobs/send-adoption-verification-code-job";

const mailProvider = new NodemailerMailProvider();

export class Worker {
  private static jobs: Array<QueueJob> = [new SendAdoptionVerificationCodeJob(mailProvider)];

  public static start() {
    this.jobs.forEach((job) => {
      job.listen();
    });
  }
}
