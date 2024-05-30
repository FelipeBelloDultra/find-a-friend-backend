import { InjectQueue } from "@nestjs/bull";
import { Injectable } from "@nestjs/common";
import { Queue } from "bull";

import { SendVerificationCode } from "~/domain/adoption/application/jobs/send-verification-code";

@Injectable()
export class SendVerificationCodeService implements SendVerificationCode {
  public constructor(
    @InjectQueue("adoption.send-verification-code.job")
    private readonly queue: Queue,
  ) {}

  public async addJob<JobDataType>(jobData: JobDataType): Promise<void> {
    await this.queue.add("adoption.send-verification-code.job", jobData);
  }
}
