import { renderHook, act } from "@testing-library/react-hooks";
import faker from "faker";

import { useCounter } from "./counter";
describe("counter hook", () => {
  it("should use initial value", () => {
    const init = faker.datatype.number(1000);
    const { result } = renderHook(() => useCounter(init));
    expect(result.current.count).toBe(init);
  });

  it("should not use init value less than zero", () => {
    const init = faker.datatype.number({ min: -1000, max: -1 });
    const { result } = renderHook(() => useCounter(init));
    expect(result.current.count).toBe(0);
  });

  it("should increment counter", () => {
    const { result } = renderHook(() => useCounter());

    act(() => {
      result.current.increment();
    });

    expect(result.current.count).toBe(1);
  });

  it("should decrement counter", () => {
    const init = faker.datatype.number(1000);
    const { result } = renderHook(() => useCounter(init));

    act(() => {
      result.current.decrement();
    });

    expect(result.current.count).toBe(init - 1);
  });

  it("should not decrement counter below zero", () => {
    const { result } = renderHook(() => useCounter());

    act(() => {
      result.current.decrement();
    });

    expect(result.current.count).toBe(0);
  });
});
