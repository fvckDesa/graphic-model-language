"use client";
import {
  createContext,
  useContext,
  ReactNode,
  useEffect,
  useState,
  useMemo,
  memo,
} from "react";
import { importProject, Project } from "projects";
import { NodeTypes } from "reactflow";
import { withNodeWrapper } from "@/hoc/withNodeWrapper";
import { Schema } from "api";

interface ProjectContextProps {
  project: Project;
}

const ProjectContext = createContext<ProjectContextProps | null>(null);

interface ProjectProviderProps {
  type: string;
  onProjectLoad: () => void;
  children: ReactNode;
}

export default function ProjectProvider({
  type,
  onProjectLoad,
  children,
}: ProjectProviderProps) {
  const [project, setProject] = useState<Project>({});

  useEffect(() => {
    importProject(type, true).then(setProject).then(onProjectLoad);
  }, [type]);

  return (
    <ProjectContext.Provider value={{ project }}>
      {children}
    </ProjectContext.Provider>
  );
}

function NoSSR({ children }: { children: ReactNode }) {
  return typeof window === "undefined" ? null : children;
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
        nodes[name] = memo(withNodeWrapper(Node));
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
