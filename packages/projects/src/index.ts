import { ComponentType } from "react";
import { TObject, TypeGuard } from "@sinclair/typebox";

type ProjectPkg = `@projects/${string}`;
export type Schema = TObject;

interface Es6Module {
  [exp: string]: unknown;
  default: unknown;
}

export const ProjectList = ["@projects/simple"] satisfies ProjectPkg[];

export interface NodeProps {
  state: object;
}

export interface NodeDef {
  Node: ComponentType<NodeProps>;
  schema: Schema;
}

export type Project = Record<string, NodeDef>;

export async function importProject(name: string): Promise<Project> {
  let module: Es6Module;
  switch (name) {
    case "simple": {
      module = await import("@projects/simple");
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
        TypeGuard.TObject(schema)
    )
  );
}
