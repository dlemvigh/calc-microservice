let counter = 0;

export const StatusValues = ["pending", "finished", "error"] as const;
export type Status = typeof StatusValues[number];

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
export async function createFactorial(item: Omit<Item, "id">) {
  const id = ++counter;
  DB[id] = { ...item, id };
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
