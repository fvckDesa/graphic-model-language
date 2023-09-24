import {
  TString,
  TNumber,
  TBoolean,
  TUnsafe,
  Kind,
  Type,
  TypeRegistry,
} from "@sinclair/typebox";

export type StringProperty = TString;
export const stringProperty = Type.String.bind(Type);

export type NumberProperty = TNumber;
export const numberProperty = Type.Number.bind(Type);

export type BooleanProperty = TBoolean;
export const booleanProperty = Type.Boolean.bind(Type);

export interface EnumProperty<V extends string> extends TUnsafe<V> {
  [Kind]: "Enum";
  enum: V[];
}

TypeRegistry.Set(
  "Enum",
  (schema: EnumProperty<string>, value) =>
    typeof value === "string" && schema.enum.includes(value)
);

export function enumProperty<A extends string[]>(
  values: [...A]
): EnumProperty<[...A][number]>;
export function enumProperty<E extends Record<string, string>>(
  values: E
): EnumProperty<E[keyof E]>;
export function enumProperty<T extends string[] | Record<string, string>>(
  values: T
) {
  const arr = Array.isArray(values) ? values : Object.values(values);
  const enumArr = [...new Set(arr)];
  return Type.Unsafe({
    [Kind]: "Enum",
    enum: enumArr,
    default: enumArr[0],
  });
}

export { Kind } from "@sinclair/typebox";

export type Property =
  | StringProperty
  | NumberProperty
  | BooleanProperty
  | EnumProperty<string>;
