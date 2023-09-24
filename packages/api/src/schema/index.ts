import {
  Static,
  TObject,
  Type,
  TArray,
  TypeGuard,
  TOmit,
  TPick,
  TComposite,
} from "@sinclair/typebox";
import { Property, StringProperty } from "./properties";
export * from "./properties";

export type Properties = Record<string, Property | TArray<Schema>>;

export type Schema<P extends Properties = Properties> = TObject<P>;

type StringProperties<P extends Properties> = {
  [K in keyof P as P[K] extends StringProperty ? K : never]: P[K];
};

type Label<S extends string | number | symbol> =
  | Exclude<S, number | symbol>
  | (NonNullable<unknown> & string);

export interface SchemaOptions<P extends Properties> {
  id: string;
  properties: P;
  label: Label<keyof StringProperties<P>>;
}

export function schema<P extends Properties>({
  id,
  properties,
  label,
}: SchemaOptions<P>): Schema<P> {
  return Type.Object(properties, { title: label || id, $id: id });
}

export type SubSchema<P extends Properties = Properties> = TArray<Schema<P>>;

export function subSchema<P extends Properties>(
  schema: Schema<P>
): SubSchema<P>;
export function subSchema<P extends Properties>(
  options: SchemaOptions<P>
): SubSchema<P>;
export function subSchema<P extends Properties>(
  schemaOrOptions: Schema<P> | SchemaOptions<P>
): SubSchema<P> {
  return Type.Array(
    isSchema(schemaOrOptions) ? schemaOrOptions : schema(schemaOrOptions)
  );
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

export type SchemaMerge<S extends Schema[]> = TComposite<S>;

type SchemaToProperties<S> = S extends Schema<infer P> ? P : never;
type StringPropertiesMerge<S extends Schema[]> = {
  [K in keyof S]: keyof StringProperties<SchemaToProperties<S[K]>>;
}[number];

export interface MergeOptions<S extends Schema[]> {
  id?: string;
  label?: Label<StringPropertiesMerge<S>>;
  schemas: [...S];
}

export function merge<S extends Schema[]>(schemas: [...S]): SchemaMerge<S>;
export function merge<S extends Schema[]>(
  options: MergeOptions<S>
): SchemaMerge<S>;
export function merge<S extends Schema[]>(
  schemasOrOptions: [...S] | MergeOptions<S>
) {
  const schemas = Array.isArray(schemasOrOptions)
    ? schemasOrOptions
    : schemasOrOptions.schemas;

  let id = schemas.length > 0 && schemas[0].$id ? schemas[0].$id : "";
  let label = schemas.length > 0 && schemas[0].title ? schemas[0].title : id;

  if ("id" in schemasOrOptions && schemasOrOptions.id) {
    id = schemasOrOptions.id;
  }
  if ("label" in schemasOrOptions && schemasOrOptions.label) {
    label = schemasOrOptions.label;
  }

  return Type.Composite(schemas, { title: label, $id: id });
}
