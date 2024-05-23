import { SendAdoptionVerificationCode } from "~/domain/adoption/application/use-cases/send-adoption-verification-code";

import { SendAdoptionVerificationCodeJob } from "../providers/queue/jobs/send-adoption-verification-code-job";

import type { MailProvider } from "~/application/providers/mail/mail-provider";

const sendAdoptionVerificationCodeJob = new SendAdoptionVerificationCodeJob();

export function startSendAdoptionVerificationCode(mailProvider: MailProvider) {
  const sendAdoptionVerificationCode = new SendAdoptionVerificationCode(mailProvider);

  sendAdoptionVerificationCodeJob.process<{
    petName: string;
    adopterName: string;
    adopterEmail: string;
    adoptionCode: string;
    codeExpiresAt: number;
  }>(async ({ data }) => {
    await sendAdoptionVerificationCode.execute(data);
  });
}
