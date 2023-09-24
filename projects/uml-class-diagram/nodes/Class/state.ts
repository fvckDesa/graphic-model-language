import { State, schema, subSchema, stringProperty } from "api";
import { AttributeSchema, ConstructorSchema, MethodSchema } from "@/core/state";

const ClassSchema = schema({
  name: "class",
  properties: {
    name: stringProperty({
      minLength: 1,
      default: "Class",
      description: "Class name",
    }),
    attributes: subSchema(AttributeSchema),
    constructors: subSchema(ConstructorSchema),
    methods: subSchema(MethodSchema),
  },
});

export type ClassState = State<typeof ClassSchema>;

export default ClassSchema;
