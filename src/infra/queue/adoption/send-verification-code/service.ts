import { InjectQueue } from "@nestjs/bull";
import { Injectable } from "@nestjs/common";
import { Queue } from "bull";

import { SendVerificationCode } from "~/domain/adoption/application/jobs/send-verification-code";

import { ADOPTION_JOBS } from "../constants";

@Injectable()
export class SendVerificationCodeService implements SendVerificationCode {
  public constructor(
    @InjectQueue(ADOPTION_JOBS.SendVerificationCode)
    private readonly queue: Queue,
  ) {}

  public async addJob<JobDataType>(jobData: JobDataType): Promise<void> {
    await this.queue.add(jobData);
  }
}
