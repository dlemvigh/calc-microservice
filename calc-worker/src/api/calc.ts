export function factorial(n: number): bigint {
  let result: bigint = 1n;

  for (let i: bigint = 1n; i <= n; i++) {
    result = result * i;
  }

  return result;
}

export type Factorial = typeof factorial;
