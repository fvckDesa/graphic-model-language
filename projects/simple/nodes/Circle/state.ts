import { State, StateSchemaType } from "api";

const CircleSchema = StateSchemaType({
  content: StateSchemaType.String({
    default: "circle",
  }),
});

export type CircleState = State<typeof CircleSchema>;

export default CircleSchema;
