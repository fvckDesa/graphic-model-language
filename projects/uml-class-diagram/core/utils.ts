import { Variable, Visibility, Attribute, Constructor, Method } from "./state";

function convertVisibility(visibility: Visibility): string | never {
  switch (visibility) {
    case Visibility.Public:
      return "+";
    case Visibility.Private:
      return "-";
    case Visibility.Protected:
      return "#";
    case Visibility.Package:
      return "~";
    default:
      throw new Error(`${visibility} is not valid`);
  }
}

export function stringifyType(type: string, isArray: boolean): string {
  return `${type}${isArray ? "[]" : ""}`;
}

export function stringifyParameter({
  name,
  type,
  arrayType,
}: Variable): string {
  // name: type
  // par1: String
  return `${name}: ${stringifyType(type, arrayType)}`;
}

export function stringifyAttribute({
  visibility,
  name,
  type,
  arrayType,
}: Attribute) {
  // visibility|name: type
  // -attribute: int[]
  return `${convertVisibility(visibility)}${name}: ${stringifyType(
    type,
    arrayType
  )}`;
}

export function stringifyConstructor(
  className: string,
  { visibility, parameters }: Constructor
) {
  return `${convertVisibility(visibility)}${className}(${parameters
    .map(stringifyParameter)
    .join(", ")})`;
}

export function stringifyMethod({
  visibility,
  name,
  parameters,
  type,
  arrayType,
}: Method) {
  // visibility|name(parameters): type
  // +myMethod(par1: String, par2: int[]): String[]
  return `${convertVisibility(visibility)}${name}(${parameters
    .map(stringifyParameter)
    .join(", ")}): ${stringifyType(type, arrayType)}`;
}
