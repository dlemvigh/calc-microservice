export interface Job {
  version: string;
  id: number;
  input: number;
  output?: string | bigint;
}
