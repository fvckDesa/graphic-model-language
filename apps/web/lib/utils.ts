export * from "cn";

export function dbg<T>(value: T): T {
  console.info("[Debug]: ", value);
  return value;
}
