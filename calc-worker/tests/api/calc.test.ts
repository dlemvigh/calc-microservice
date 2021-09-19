import "mocha";
import { expect } from "chai";
import { factorial } from "../../src/api/calc";

describe("calc", () => {
  const cases: [number, bigint][] = [
    [1, 1n],
    [2, 2n],
    [3, 6n],
    [4, 24n],
    [5, 120n],
    [10, 3628800n],
    [20, 2432902008176640000n],
    [
      100,
      93326215443944152681699238856266700490715968264381621468592963895217599993229915608941463976156518286253697920827223758251185210916864000000000000000000000000n,
    ],
  ];

  cases.forEach(([input, expected]) => {
    it(`${input}! = ${expected}`, () => {
      const actual = factorial(input);
      expect(actual).to.equal(expected);
    });
  });
});

describe.skip("slow/hard calculations", function () {
  this.timeout(10 * 1000);
  const cases = [26, 30, 35, 40, 45, 50, 55, 60];
  cases.forEach((input) => {
    it(`${input}k!`, () => {
      expect(factorial(input * 1000).toString().length).to.be.greaterThan(0);
    });
  });
});
