export function ifWindow<T>(fn: () => T) {
  if (typeof window !== "undefined") {
    return fn();
  }
}
