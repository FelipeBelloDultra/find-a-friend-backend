import { Process, Processor } from "@nestjs/bull";
import { Job } from "bull";

import { SendAdoptionVerificationCode } from "~/domain/adoption/application/use-cases/send-adoption-verification-code";

@Processor("adoption.send-verification-code.job")
export class SendVerificationCodeConsumer {
  public constructor(private readonly sendAdoptionVerificationCode: SendAdoptionVerificationCode) {}

  @Process()
  public async handle(
    job: Job<{
      petName: string;
      adopterName: string;
      adopterEmail: string;
      adoptionCode: string;
      codeExpiresAt: number;
    }>,
  ) {
    const { data } = job;

    await this.sendAdoptionVerificationCode.execute(data);
  }
}
