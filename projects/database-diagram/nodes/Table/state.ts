import {
  State,
  schema,
  subSchema,
  stringProperty,
  booleanProperty,
  enumProperty,
} from "api";

export enum RowType {
  None = "none",
  Unique = "unique",
  PrimaryKey = "primary-key",
  ForeignKey = "foreign-key",
}

const RowSchema = schema({
  id: "rows",
  label: "name",
  properties: {
    name: stringProperty({
      minLength: 1,
      description: "Row name",
    }),
    value: stringProperty({
      minLength: 1,
      description: "Row value type",
    }),
    nullable: booleanProperty(),
    type: enumProperty(RowType),
  },
});

const TableSchema = schema({
  id: "table",
  label: "name",
  properties: {
    name: stringProperty({
      minLength: 1,
      default: "table",
      description: "Table name",
    }),
    rows: subSchema(RowSchema),
  },
});

export type TableState = State<typeof TableSchema>;

export default TableSchema;
