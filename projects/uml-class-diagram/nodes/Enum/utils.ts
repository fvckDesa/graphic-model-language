import { Literal } from "./state";

export function stringifyEnumLiteral({ name, value }: Literal) {
  return name + (value ? ` = ${value}` : "");
}
