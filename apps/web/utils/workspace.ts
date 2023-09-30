import { Static, Type } from "@sinclair/typebox";

export enum Projects {
  Simple = "simple",
  UmlClassDiagram = "uml-class-diagram",
}

export const NewWorkspaceSchema = Type.Object({
  name: Type.String({
    minLength: 1,
  }),
  project: Type.Enum(Projects),
});

export type NewWorkspace = Static<typeof NewWorkspaceSchema>;

export const WorkspaceIdSchema = Type.Object({
  id: Type.String({
    minLength: 1,
  }),
});

export type WorkspaceId = Static<typeof WorkspaceIdSchema>;