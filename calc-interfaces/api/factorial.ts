type Status = "pending" | "finished" | "error";

export interface Item {
  id: number;
  input: number;
  output?: bigint;
  status: Status;
  createdAt: Date;
  finishedAt?: Date;
}

export type GetFactorialsResponse = Item[];

export type PostFactorialRequest = {
  input: number;
};

export type PostFactorialResponse = Item;

export type PutFactorialRequest = Partial<Item>;

export type PutFactorialResponse = Item;
