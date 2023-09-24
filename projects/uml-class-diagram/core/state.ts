import {
  State,
  schema,
  subSchema,
  stringProperty,
  enumProperty,
  booleanProperty,
  merge,
} from "api";

export const VariableSchema = schema({
  name: "parameters",
  properties: {
    name: stringProperty({
      minLength: 1,
      description: "Variable name",
    }),
    type: stringProperty({
      minLength: 1,
      description: "Variable type",
    }),
    arrayType: booleanProperty({
      description: "Indicate if variable is an array",
    }),
  },
});

export type Variable = State<typeof VariableSchema>;

export enum Visibility {
  Public = "public",
  Private = "private",
  Protected = "protected",
  Package = "package",
}

export const AttributeSchema = merge([
  schema({
    name: "attributes",
    properties: {
      visibility: enumProperty(Visibility),
    },
  }),
  VariableSchema,
]);

export type Attribute = State<typeof AttributeSchema>;

export const ConstructorSchema = schema({
  name: "constructors",
  properties: {
    visibility: enumProperty(Visibility),
    parameters: subSchema(VariableSchema),
  },
});

export type Constructor = State<typeof ConstructorSchema>;

export const MethodSchema = merge([
  schema({
    name: "methods",
    properties: {
      parameters: subSchema(VariableSchema),
    },
  }),
  AttributeSchema,
]);

export type Method = State<typeof MethodSchema>;
