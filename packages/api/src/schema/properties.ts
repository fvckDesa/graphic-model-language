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
export function enumProperty<T extends string[]>(values: [...T]) {
  return Type.Unsafe({
    [Kind]: "Enum",
    enum: values,
    default: values[0],
  }) as EnumProperty<[...T][number]>;
}

export { Kind } from "@sinclair/typebox";

export type Property =
  | StringProperty
  | NumberProperty
  | BooleanProperty
  | EnumProperty<string>;
