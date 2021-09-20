import { useState, useCallback } from "react";

export function useCounter(init?: number) {
  const [count, setCount] = useState(Math.max(init || 0, 0));

  const increment = useCallback(() => setCount((x) => x + 1), []);
  const decrement = useCallback(() => setCount((x) => Math.max(x - 1, 0)), []);

  return { count, increment, decrement };
}
