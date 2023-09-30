import { ComponentType } from "react";
import { NodeProps, Schema, GenericState, isSchema } from "api";

interface Es6Module {
  [exp: string]: unknown;
  default: unknown;
}

export enum ProjectsList {
  Simple = "simple",
  UmlClassDiagram = "uml-class-diagram",
  DatabaseDiagram = "database-diagram",
}
export interface NodeDef {
  Node: ComponentType<NodeProps<GenericState>>;
  schema: Schema;
}

export type Project = Record<string, NodeDef>;

export async function importProject(
  name: string,
  css = false
): Promise<Project> {
  let module: Es6Module;
  switch (name) {
    case "simple": {
      module = await import("@projects/simple");
      if (css) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore 2307
        await import("@projects/simple/style.css");
      }
      break;
    }
    case "uml-class-diagram": {
      module = await import("@projects/uml-class-diagram");
      if (css) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore 2307
        await import("@projects/uml-class-diagram/style.css");
      }
      break;
    }
    case "database-diagram": {
      module = await import("@projects/database-diagram");
      if (css) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore 2307
        await import("@projects/database-diagram/style.css");
      }
      break;
    }
    default: {
      throw new Error(`Project '${name}' not found`);
    }
  }

  const project = module.default;

  if (!isProject(project)) {
    throw new Error(`Project '${name}' is not valid`);
  }

  return project;
}

export function isProject(obj: unknown): obj is Project {
  return (
    !!obj &&
    typeof obj === "object" &&
    Object.entries(obj).every(
      ([name, { Node, schema }]) =>
        typeof name === "string" &&
        typeof Node === "function" &&
        isSchema(schema)
    )
  );
}
