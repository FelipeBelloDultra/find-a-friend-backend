import { QueueProvider } from "~/application/providers/queue/queue-provider";

export class FakeQueueProvider implements QueueProvider {
  public async addJob<JobDataType>(_: JobDataType): Promise<void> {}

  public process<ProcessDataType>(_: (job: { data: ProcessDataType }) => Promise<void>): void {}
}
