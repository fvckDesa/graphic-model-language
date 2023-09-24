import {
  State,
  merge,
  schema,
  subSchema,
  stringProperty,
  booleanProperty,
} from "api";
import { AttributeSchema, ConstructorSchema, MethodSchema } from "@/core/state";

const AbstractMethodSchema = merge({
  label: "name",
  schemas: [
    schema({
      id: "methods",
      label: "method",
      properties: {
        abstract: booleanProperty({
          description: "Indicate if it's an abstract method",
        }),
      },
    }),
    MethodSchema,
  ],
});

const AbstractSchema = schema({
  id: "abstract",
  label: "name",
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
