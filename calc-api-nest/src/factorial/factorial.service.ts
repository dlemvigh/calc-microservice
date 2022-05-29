import { Injectable } from '@nestjs/common';
import { Factorial, Status } from './factorial.type';

@Injectable()
export class FactorialService {
  private counter = 0;
  private readonly db: Map<number, Factorial> = new Map([
    [
      1,
      {
        id: 1,
        input: 5,
        output: '120',
        status: Status.Finished,
        createdAt: new Date(),
        finishedAt: new Date(),
      },
    ],
  ]);

  create(factorial: Omit<Factorial, 'id'>) {
    const id = ++this.counter;
    this.db.set(id, { ...factorial, id });
    return this.db.get(id);
  }

  update(id: number, factorial: Partial<Factorial>) {
    const updatedFactorial = Object.assign({}, this.db.get(id), factorial);
    this.db.set(id, updatedFactorial);
    return updatedFactorial;
  }

  get(id: number) {
    return this.db.get(id);
  }

  getAll() {
    return Array.from(this.db.values());
  }

  clear() {
    this.db.clear();
    this.counter = 0;
  }
}
