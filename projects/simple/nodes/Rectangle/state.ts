import {
  State,
  schema,
  stringProperty,
  booleanProperty,
  enumProperty,
  subSchema,
  numberProperty,
} from "api";

const RectangleSchema = schema({
  id: "rectangle",
  label: "content",
  properties: {
    content: stringProperty({
      default: "rectangle",
      minLength: 1,
      description: "rectangle content",
    }),
    sub: subSchema({
      id: "sub",
      label: "sub",
      properties: {
        str: stringProperty(),
        num: numberProperty({ description: "num" }),
        enum: enumProperty(["red", "blue", "green"]),
        bool: booleanProperty({ description: "bool" }),
      },
    }),
  },
});

export type RectangleState = State<typeof RectangleSchema>;

export default RectangleSchema;
