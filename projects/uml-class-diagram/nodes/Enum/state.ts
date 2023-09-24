import { State, schema, subSchema, stringProperty } from "api";

const LiteralSchema = schema({
  id: "literals",
  label: "name",
  properties: {
    name: stringProperty({
      minLength: 1,
      default: "name",
      description: "Enum literal name",
    }),
    value: stringProperty({
      description: "Enum literal value",
    }),
  },
});

export type Literal = State<typeof LiteralSchema>;

const EnumSchema = schema({
  id: "enum",
  label: "name",
  properties: {
    name: stringProperty({
      minLength: 1,
      default: "Enum",
      description: "Enum name",
    }),
    literals: subSchema(LiteralSchema),
  },
});

export type EnumState = State<typeof EnumSchema>;

export default EnumSchema;
