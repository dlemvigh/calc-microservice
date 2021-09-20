import { useState, useCallback } from "react";
import { renderHook, act } from "@testing-library/react-hooks";
import faker from "faker";
function useCounter(init?: number) {
  const [count, setCount] = useState(Math.max(init || 0, 0));

  const increment = useCallback(() => setCount((x) => x + 1), []);
  const decrement = useCallback(() => setCount((x) => Math.max(x - 1, 0)), []);

  return { count, increment, decrement };
}

test("should use initial value", () => {
  const init = faker.datatype.number(1000);
  const { result } = renderHook(() => useCounter(init));
  expect(result.current.count).toBe(init);
});

test("should not use init value less than zero", () => {
  const init = faker.datatype.number({ min: -1000, max: -1 });
  const { result } = renderHook(() => useCounter(init));
  expect(result.current.count).toBe(0);
});

test("should increment counter", () => {
  const { result } = renderHook(() => useCounter());

  act(() => {
    result.current.increment();
  });

  expect(result.current.count).toBe(1);
});

test("should decrement counter", () => {
  const init = faker.datatype.number(1000);
  const { result } = renderHook(() => useCounter(init));

  act(() => {
    result.current.decrement();
  });

  expect(result.current.count).toBe(init - 1);
});

test("should not decrement counter below zero", () => {
  const { result } = renderHook(() => useCounter());

  act(() => {
    result.current.decrement();
  });

  expect(result.current.count).toBe(0);
});
