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
export interface MergeOptions<S extends Schema[]> {
  name?: string;
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

  let name = schemas.length > 0 ? schemas[0].title! : "";
  if ("name" in schemasOrOptions && schemasOrOptions.name) {
    name = schemasOrOptions.name;
  }
  return Type.Composite(schemas, { title: name });
}
