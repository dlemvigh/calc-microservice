let counter = 0;

type Status = "pending" | "finished" | "error";

export interface Item {
  id: number;
  input: number;
  output?: string;
  status: Status;
  createdAt: Date;
  calcStartedAt?: Date;
  finishedAt?: Date;
}

interface Database {
  [id: number]: Item;
}

const DB: Database = {};

export async function createFactorial(item: Partial<Item>) {
  const id = ++counter;
  DB[id] = { ...item, id } as Item;
  return DB[id];
}

export async function updateFractorial(id: number, item: Partial<Item>) {
  const newItem = Object.assign({}, DB[id], item);
  DB[id] = newItem;
  return newItem;
}

export async function getFactorial(id: number) {
  return DB[id];
}

export async function getFactorials(): Promise<Item[]> {
  const items = Object.values(DB);
  return items;
}

export async function clearFactorials(): Promise<void> {
  for (const id of Object.keys(DB)) {
    delete DB[Number(id)];
  }
  counter = 0;
}

export const factorialRepository = {
  createFactorial,
  updateFractorial,
  getFactorial,
  getFactorials,
  clearFactorials,
};

export type FactorialRepository = typeof factorialRepository;
