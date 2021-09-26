import "mocha";
import { expect } from "chai";
import { trunkOutput } from "../../src/routes/factorial/util";

describe("trunk output - max length 3", () => {
  const cases: [string, string][] = [
    ["1", "1"],
    ["12", "12"],
    ["123", "123"],
    ["1234", "123e1"],
    ["12345", "123e2"],
    ["123456", "123e3"],
  ];
  cases.forEach(([input, expected]) => {
    it(`${input} => ${expected}`, () => {
      expect(trunkOutput(input, 3)).to.equal(expected);
    });
  });
});
