export abstract class QueueProvider {
  public abstract addJob: <JobDataType>(jobData: JobDataType) => Promise<void>;
}

export interface QueueJob {
  listen: () => void;
}
