import { BullQueueProvider } from "../bullmq-queue-provider";

export class SendAdoptionVerificationCodeJob extends BullQueueProvider {
  public constructor() {
    super("send-adoption-verification-code");
  }
}
