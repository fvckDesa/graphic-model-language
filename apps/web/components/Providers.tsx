"use client";
import { PropsWithChildren } from "react";
import { ReactFlowProvider } from "reactflow";
import ProjectProvider from "@/contexts/project";
import WorkspaceProvider from "@/contexts/workspace";

interface ProvidersProps {
  projectType: string;
  workspaceId: string;
}

function Providers({
  projectType,
  workspaceId,
  children,
}: PropsWithChildren<ProvidersProps>) {
  return (
    <ProjectProvider type={projectType}>
      <WorkspaceProvider workspaceId={workspaceId}>
        <ReactFlowProvider>{children}</ReactFlowProvider>
      </WorkspaceProvider>
    </ProjectProvider>
  );
}

export default Providers;
