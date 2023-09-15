"use client";
import {
  createContext,
  useContext,
  ReactNode,
  useEffect,
  useState,
  useMemo,
} from "react";
import { importProject, Project, Schema } from "projects";
import { NodeTypes } from "reactflow";
import { withNodeWrapper } from "@/hoc/withNodeWrapper";

interface ProjectContextProps {
  project: Project;
}

const ProjectContext = createContext<ProjectContextProps | null>(null);

interface ProjectProviderProps {
  type: string;
  children: ReactNode;
}

export default function ProjectProvider({
  type,
  children,
}: ProjectProviderProps) {
  const [project, setProject] = useState<Project>({});

  useEffect(() => {
    importProject(type).then(setProject);
  }, [type]);

  return (
    <ProjectContext.Provider value={{ project }}>
      {children}
    </ProjectContext.Provider>
  );
}

export function useProject() {
  const ctx = useContext(ProjectContext);
  if (!ctx) {
    throw new Error("'useProject' need to be wrap in a 'ProjectProvider'");
  }

  return ctx;
}

export function useProjectNodes(): NodeTypes {
  const { project } = useProject();

  const nodes = useMemo<NodeTypes>(
    () =>
      Object.entries(project).reduce<NodeTypes>((nodes, [name, { Node }]) => {
        nodes[name] = withNodeWrapper(Node);
        return nodes;
      }, {}),
    [project]
  );

  return nodes;
}

export function useSchema(node: string): Schema {
  const { project } = useProject();

  if (!(node in project)) {
    throw new Error(`Node '${node}' not exists`);
  }

  const schema = useMemo(() => project[node].schema, [project, node]);

  return schema;
}
