import {
  Static,
  TObject,
  Type,
  TArray,
  TypeGuard,
  TOmit,
  TPick,
} from "@sinclair/typebox";
import { Property } from "./properties";
export * from "./properties";

export type Properties = Record<string, Property | TArray<Schema>>;

export type Schema<P extends Properties = Properties> = TObject<P>;

export interface SchemaOptions<P extends Properties> {
  name: string;
  properties: P;
}

export function schema<P extends Properties>({
  name,
  properties,
}: SchemaOptions<P>): Schema<P> {
  return Type.Object(properties, { title: name });
}

export type SubSchema<P extends Properties = Properties> = TArray<Schema<P>>;

export function subSchema<P extends Properties>(
  options: SchemaOptions<P>
): SubSchema<P> {
  return Type.Array(schema(options));
}

export type State<S extends Schema> = Static<S>;

export type GenericState = State<Schema<Properties>>;

export function isSchema(schema: unknown): schema is Schema {
  return TypeGuard.TObject(schema);
}

export function isSubSchema(schema: unknown): schema is SubSchema {
  return TypeGuard.TArray(schema);
}

export type SchemaOmit<S extends Schema> = TOmit<S, string>;
export const omit = Type.Omit.bind(Type);

export type SchemaPick<S extends Schema> = TPick<S, string>;
export const pick = Type.Pick.bind(Type);
