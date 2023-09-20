import { State, StateSchemaType } from "api";

const RectangleSchema = StateSchemaType({
  content: StateSchemaType.String({
    default: "rect",
    minLength: 1,
    description: "Rectangle content string",
  }),
});

export type RectangleState = State<typeof RectangleSchema>;

export default RectangleSchema;
