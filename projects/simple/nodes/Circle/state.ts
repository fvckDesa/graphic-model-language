import { State, schema, stringProperty } from "api";

const CircleSchema = schema({
  name: "circle",
  properties: {
    content: stringProperty({ default: "circle" }),
  },
});

export type CircleState = State<typeof CircleSchema>;

export default CircleSchema;
