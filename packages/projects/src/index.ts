import { ComponentType } from "react";
import { NodeProps, State, StateSchema, isStateSchema } from "api";

type ProjectPkg = `@projects/${string}`;

interface Es6Module {
  [exp: string]: unknown;
  default: unknown;
}

export const ProjectList = ["@projects/simple"] satisfies ProjectPkg[];

export interface NodeDef {
  Node: ComponentType<NodeProps<State<StateSchema>>>;
  schema: StateSchema;
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
        isStateSchema(schema)
    )
  );
}
