export interface Job {
  version: string;
  id: number;
  input: number;
  output?: string | bigint;
  calcStartedAt?: Date;
  finishedAt?: Date;
  status: string;
}
