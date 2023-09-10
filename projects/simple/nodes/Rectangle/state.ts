import { Static, Type } from "@sinclair/typebox";

const RectangleSchema = Type.Object({
  content: Type.String({
    default: "rect",
  }),
});

export type RectangleState = Static<typeof RectangleSchema>;

export default RectangleSchema;
