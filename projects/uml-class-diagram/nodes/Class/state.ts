import { State, schema, stringProperty } from "api";

const ClassSchema = schema({
  name: "class",
  properties: {
    content: stringProperty({
      default: "Class",
    }),
  },
});

export type ClassState = State<typeof ClassSchema>;

export default ClassSchema;
