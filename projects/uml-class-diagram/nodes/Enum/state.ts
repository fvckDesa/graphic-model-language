import { State, schema, subSchema, stringProperty } from "api";

const LiteralSchema = schema({
  name: "literals",
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
  name: "enum",
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
