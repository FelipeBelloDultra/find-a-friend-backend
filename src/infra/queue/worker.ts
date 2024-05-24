import { NodemailerMailProvider } from "../providers/mail/nodemailer-mail-provider";
import { SendAdoptionVerificationCodeJob } from "../providers/queue/jobs/send-adoption-verification-code-job";

import type { QueueJob } from "~/application/providers/queue/queue-provider";

const mailProvider = new NodemailerMailProvider();

[new SendAdoptionVerificationCodeJob(mailProvider)].forEach((job: QueueJob) => {
  job.listen();
});
