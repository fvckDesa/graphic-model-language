import {
  State,
  merge,
  schema,
  subSchema,
  stringProperty,
  booleanProperty,
} from "api";
import { AttributeSchema, ConstructorSchema, MethodSchema } from "@/core/state";

const AbstractMethodSchema = merge([
  schema({
    name: "methods",
    properties: {
      abstract: booleanProperty({
        description: "Indicate if it's an abstract method",
      }),
    },
  }),
  MethodSchema,
]);

const AbstractSchema = schema({
  name: "abstract",
  properties: {
    name: stringProperty({
      minLength: 1,
      default: "Abstract",
      description: "Abstract class name",
    }),
    attributes: subSchema(AttributeSchema),
    constructors: subSchema(ConstructorSchema),
    methods: subSchema(AbstractMethodSchema),
  },
});

export type AbstractState = State<typeof AbstractSchema>;

export default AbstractSchema;
