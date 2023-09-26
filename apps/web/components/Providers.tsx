"use client";
import { PropsWithChildren, useState } from "react";
import { ReactFlowProvider } from "reactflow";
import ProjectProvider from "@/contexts/project";
import WorkspaceProvider from "@/contexts/workspace";
import { CheckCircle, Loader2 } from "lucide-react";

interface ProvidersProps {
  projectType: string;
  workspaceId: string;
}

function Providers({
  projectType,
  workspaceId,
  children,
}: PropsWithChildren<ProvidersProps>) {
  const [projectLoad, setProjectLoad] = useState(false);

  return (
    <ProjectProvider
      type={projectType}
      onProjectLoad={() => setProjectLoad(true)}
    >
      {projectLoad ? (
        <WorkspaceProvider workspaceId={workspaceId}>
          <ReactFlowProvider>{children}</ReactFlowProvider>
        </WorkspaceProvider>
      ) : (
        <ScreenLoader>
          <Loader loaded={projectLoad}>Import Project '{projectType}'</Loader>
        </ScreenLoader>
      )}
    </ProjectProvider>
  );
}

export default Providers;

function ScreenLoader({ children }: PropsWithChildren) {
  return (
    <div className="bg-primary text-secondary flex h-screen w-screen flex-col items-center justify-center gap-4">
      <h1 className="text-2xl">Loading Workspace</h1>
      <div className="flex flex-col items-center justify-center gap-2">
        {children}
      </div>
    </div>
  );
}

interface LoaderProps {
  loaded: boolean;
}

function Loader({ loaded, children }: PropsWithChildren<LoaderProps>) {
  return (
    <div className="flex items-center gap-2">
      {loaded ? <CheckCircle /> : <Loader2 className="animate-spin" />}
      <h2 className="text-lg">{children}</h2>
    </div>
  );
}
