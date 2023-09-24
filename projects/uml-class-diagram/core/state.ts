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
  id: "parameters",
  label: "name",
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

export const AttributeSchema = merge({
  label: "name",
  schemas: [
    schema({
      id: "attributes",
      label: "attribute",
      properties: {
        visibility: enumProperty(Visibility),
      },
    }),
    VariableSchema,
  ],
});

export type Attribute = State<typeof AttributeSchema>;

export const ConstructorSchema = schema({
  id: "constructors",
  label: "constructor",
  properties: {
    visibility: enumProperty(Visibility),
    parameters: subSchema(VariableSchema),
  },
});

export type Constructor = State<typeof ConstructorSchema>;

export const MethodSchema = merge({
  label: "name",
  schemas: [
    schema({
      id: "methods",
      label: "method",
      properties: {
        parameters: subSchema(VariableSchema),
      },
    }),
    AttributeSchema,
  ],
});

export type Method = State<typeof MethodSchema>;
