import "mocha";
import { expect } from "chai";
import faker from "faker";
import {
  factorialRepository as repo,
  StatusValues,
} from "../../src/db/factorial";

describe("database tests", () => {
  beforeEach(async () => {
    repo.clearFactorials();
  });

  function fakeItem() {
    const input = faker.datatype.number(1000);
    const createdAt = faker.datatype.datetime();
    const status = faker.random.arrayElement(StatusValues);
    return { input, createdAt, status };
  }

  it("is initially empty", async () => {
    expect(await repo.getFactorials()).to.eql([]);
  });

  it("get non-existing returns undefined", async () => {
    expect(await repo.getFactorial(1)).to.equal(undefined);
  });

  it("create item", async () => {
    const { input, createdAt, status } = fakeItem();
    expect(await repo.createFactorial({ input, createdAt, status })).to.eql({
      id: 1,
      input,
      createdAt,
      status,
    });
  });

  it("get item, with single item", async () => {
    const { input, createdAt, status } = fakeItem();
    repo.createFactorial({ input, createdAt, status });
    expect(await repo.getFactorial(1)).to.eql({
      id: 1,
      input,
      createdAt,
      status,
    });
  });

  it("get items, with single item", async () => {
    const { input, createdAt, status } = fakeItem();
    repo.createFactorial({ input, createdAt, status });
    expect(await repo.getFactorials()).to.eql([
      { id: 1, input, createdAt, status },
    ]);
  });

  it("update item, partial update", async () => {
    const { input, createdAt, status } = fakeItem();
    const output = faker.datatype.number(1000).toString();
    repo.createFactorial({ input, createdAt, status });
    expect(await repo.updateFractorial(1, { output })).to.eql({
      id: 1,
      input,
      createdAt,
      status,
      output,
    });
  });

  it("update item, override", async () => {
    const { input, createdAt, status } = fakeItem();
    const input_override = faker.datatype.number(1000);
    repo.createFactorial({ input, createdAt, status });
    expect(await repo.updateFractorial(1, { input: input_override })).to.eql({
      id: 1,
      input: input_override,
      createdAt,
      status,
    });
  });

  it("get updated item", async () => {
    const { input, createdAt, status } = fakeItem();
    const output = faker.datatype.number(1000).toString();
    repo.createFactorial({ input, createdAt, status });
    repo.updateFractorial(1, { output });
    expect(await repo.getFactorial(1)).to.eql({
      id: 1,
      input,
      createdAt,
      status,
      output,
    });
  });

  it("clear items", async () => {
    const { input, createdAt, status } = fakeItem();
    repo.createFactorial({ input, createdAt, status });
    repo.clearFactorials();
    expect(await repo.getFactorial(1)).to.eql(undefined);
    expect(await repo.getFactorials()).to.eql([]);
  });
});
