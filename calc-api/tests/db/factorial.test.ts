import "mocha";
import { expect } from "chai";
import faker from "faker";
import { factorialRepository as repo } from "../../src/db/factorial";

describe("database tests", () => {

  beforeEach(async () => {
    repo.clearFactorials();
  })

  it("is initially empty", async () => {
    expect(await repo.getFactorials()).to.eql([]);
  })

  it("get non-existing returns undefined", async ()=>{
    expect(await repo.getFactorial(1)).to.equal(undefined);
  })

  it("create item", async ()=>{
    const input = faker.datatype.number(1000);
    expect(await repo.createFactorial({ input })).to.eql({ id: 1, input });
  })

  it("get item, with single item", async () => {
    const input = faker.datatype.number(1000);
    repo.createFactorial({ input });
    expect(await repo.getFactorial(1)).to.eql({ id: 1, input });
  })

  it("get items, with single item", async () => {
    const input = faker.datatype.number(1000);
    repo.createFactorial({ input });
    expect(await repo.getFactorials()).to.eql([{ id: 1, input }]);
  })

  it("update item, partial update", async () => {
    const input = faker.datatype.number(1000);
    const output = faker.datatype.number(1000).toString();
    repo.createFactorial({ input });
    expect(await repo.updateFractorial(1, { output })).to.eql({ id: 1, input, output });
  })

  it("update item, override", async () => {
    const input = faker.datatype.number(1000);
    const input_override = faker.datatype.number(1000);
    repo.createFactorial({ input });
    expect(await repo.updateFractorial(1, { input: input_override })).to.eql({ id: 1, input: input_override });
  })

  it("get updated item", async () => {
    const input = faker.datatype.number(1000);
    const output = faker.datatype.number(1000).toString();
    repo.createFactorial({ input });
    repo.updateFractorial(1, { output })
    expect(await repo.getFactorial(1)).to.eql({ id: 1, input, output });
  })

  it("clear items", async () => {
    const input = faker.datatype.number(1000);
    repo.createFactorial({ input });
    repo.clearFactorials()
    expect(await repo.getFactorial(1)).to.eql(undefined);
    expect(await repo.getFactorials()).to.eql([]);
  })
})