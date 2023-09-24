import "./style.css";
import { ClassNode, ClassSchema } from "./nodes/Class";
import { EnumNode, EnumSchema } from "./nodes/Enum";
import { AbstractNode, AbstractSchema } from "./nodes/Abstract";
import { InterfaceNode, InterfaceSchema } from "./nodes/Interface";

export default {
  class: {
    Node: ClassNode,
    schema: ClassSchema,
  },
  enum: {
    Node: EnumNode,
    schema: EnumSchema,
  },
  abstract: {
    Node: AbstractNode,
    schema: AbstractSchema,
  },
  interface: {
    Node: InterfaceNode,
    schema: InterfaceSchema,
  },
};
