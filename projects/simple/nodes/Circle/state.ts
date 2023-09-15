import { Static, Type } from "@sinclair/typebox";

const CircleSchema = Type.Object({
  content: Type.String({
    default: "circle",
  }),
});

export type CircleState = Static<typeof CircleSchema>;

export default CircleSchema;
