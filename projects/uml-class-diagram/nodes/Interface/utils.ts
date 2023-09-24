import { Visibility } from "@/core/state";
import { stringifyAttribute, stringifyMethod } from "@/core/utils";
import { InterfaceAttribute, InterfaceMethod } from "./state";

export function stringifyInterfaceAttribute(attribute: InterfaceAttribute) {
  return stringifyAttribute({ ...attribute, visibility: Visibility.Public });
}

export function stringifyInterfaceMethod(method: InterfaceMethod) {
  return stringifyMethod({ ...method, visibility: Visibility.Public });
}
