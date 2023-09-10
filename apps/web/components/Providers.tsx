"use client";
import { PropsWithChildren } from "react";
import { ReactFlowProvider } from "reactflow";
import ProjectProvider from "@/contexts/project";

interface ProvidersProps {
  projectType: string;
}

function Providers({
  projectType,
  children,
}: PropsWithChildren<ProvidersProps>) {
  return (
    <ProjectProvider type={projectType}>
      <ReactFlowProvider>{children}</ReactFlowProvider>
    </ProjectProvider>
  );
}

export default Providers;
