import { Static, Type } from "@sinclair/typebox";

export enum ProjectsList {
  //Simple = "simple", only for test
  UmlClassDiagram = "uml-class-diagram",
  DatabaseDiagram = "database-diagram",
}

export const NewWorkspaceSchema = Type.Object({
  name: Type.String({
    minLength: 1,
  }),
  project: Type.Enum(ProjectsList),
});

export type NewWorkspace = Static<typeof NewWorkspaceSchema>;

export const WorkspaceIdSchema = Type.Object({
  id: Type.String({
    minLength: 1,
  }),
});

export type WorkspaceId = Static<typeof WorkspaceIdSchema>;
