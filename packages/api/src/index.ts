import {
  TString,
  TNumber,
  TBoolean,
  TUnsafe,
  TObject,
  Static,
  Kind,
  Type,
  TypeRegistry,
  TypeGuard,
} from "@sinclair/typebox";

export interface EnumProperty<V extends string> extends TUnsafe<V> {
  [Kind]: "Enum";
  enum: V[];
}

TypeRegistry.Set(
  "Enum",
  (schema: EnumProperty<string>, value) =>
    typeof value === "string" && schema.enum.includes(value)
);
function Enum<T extends string[]>(values: [...T]) {
  return Type.Unsafe({ [Kind]: "Enum", enum: values }) as EnumProperty<
    [...T][number]
  >;
}

export type StateSchema = TObject<Record<string, StateSchemaProperty>>;

export function isStateSchema(
  stateSchema: unknown
): stateSchema is StateSchema {
  return TypeGuard.TObject(stateSchema);
}

export const StateSchemaType = Object.assign(Type.Object.bind(Type), {
  String: Type.String.bind(Type),
  Number: Type.Number.bind(Type),
  Boolean: Type.Boolean.bind(Type),
  Enum,
});

export type StringProperty = TString;
export type NumberProperty = TNumber;
export type BooleanProperty = TBoolean;

export type StateSchemaProperty = {
  [K in keyof typeof StateSchemaType]: ReturnType<(typeof StateSchemaType)[K]>;
}[keyof typeof StateSchemaType];

export type State<T extends StateSchema> = Static<T>;

export interface NodeProps<S extends State<StateSchema>> {
  state: S;
}

export function getStateSchemaPropertyKind<P extends StateSchemaProperty>(
  property: P
): P[typeof Kind] {
  return property[Kind];
}
