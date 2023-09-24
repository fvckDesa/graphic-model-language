import { State, schema, stringProperty } from "api";

const CircleSchema = schema({
  id: "circle",
  label: "content",
  properties: {
    content: stringProperty({ default: "circle" }),
  },
});

export type CircleState = State<typeof CircleSchema>;

export default CircleSchema;
