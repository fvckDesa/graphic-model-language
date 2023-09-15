import "./style.css";
import { RectangleNode, RectangleSchema } from "./nodes/Rectangle";
import { CircleNode, CircleSchema } from "./nodes/Circle";

export default {
  rectangle: {
    Node: RectangleNode,
    schema: RectangleSchema,
  },
  circle: {
    Node: CircleNode,
    schema: CircleSchema,
  },
};
