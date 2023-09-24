import { State, schema, subSchema, merge, stringProperty } from "api";
import { VariableSchema } from "@/core/state";

const AttributeSchema = merge({
  name: "attributes",
  schemas: [VariableSchema],
});

export type InterfaceAttribute = State<typeof AttributeSchema>;

const MethodSchema = merge([
  schema({
    name: "methods",
    properties: { parameters: subSchema(VariableSchema) },
  }),
  VariableSchema,
]);

export type InterfaceMethod = State<typeof MethodSchema>;

const InterfaceSchema = schema({
  name: "interface",
  properties: {
    name: stringProperty({
      minLength: 1,
      default: "Interface",
      description: "Interface name",
    }),
    attributes: subSchema(AttributeSchema),
    methods: subSchema(MethodSchema),
  },
});

export type InterfaceState = State<typeof InterfaceSchema>;

export default InterfaceSchema;
