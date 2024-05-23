import { Queue, Worker } from "bullmq";

import { RedisConnection } from "~/infra/redis/connection";

import type { Processor } from "bullmq";
import type { QueueProvider } from "~/application/providers/queue/queue-provider";

export class BullQueueProvider implements QueueProvider {
  private readonly queue: Queue;
  private readonly queueName: string;

  public constructor(queueName: string) {
    this.queueName = queueName;
    this.queue = new Queue(this.queueName, {
      connection: RedisConnection.client,
      defaultJobOptions: {
        removeOnComplete: true,
        attempts: 2,
      },
    });
  }

  public async addJob<JobDataType>(jobData: JobDataType) {
    await this.queue.add("message", jobData, {
      delay: 500, // 500 milliseconds to add job to queue
    });
  }

  public process<ProcessDataType>(processFunction: Processor<ProcessDataType>) {
    new Worker(this.queueName, processFunction, {
      connection: RedisConnection.client,
      limiter: {
        // 5 job per 1 minutes will be processed
        max: 5,
        duration: 1000,
      },
    })
      .on("completed", (job) => {
        process.stdout.write(`${this.queueName} - [${job.name}-${job.id || "UNDEFINED"}] - completed\n`);
      })
      .on("active", (job) => {
        process.stdout.write(`${this.queueName} - [${job.name}-${job.id || "UNDEFINED"}] - active\n`);
      })
      .on("failed", (job) => {
        process.stdout.write(
          `${this.queueName} - [${job?.name || "NOT_NAMED"}-${
            job?.id || "UNDEFINED"
          }] - failed - ${job?.failedReason}\n`,
        );
      });
  }
}
