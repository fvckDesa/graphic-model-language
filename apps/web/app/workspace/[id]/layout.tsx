import "./editor.css";

import { PropsWithChildren } from "react";
import Providers from "@/components/Providers";
import NodeList from "@/components/NodeList";
import EditorTree from "@/components/EditorTree";

interface WorkspaceProps {
  params: { id: string };
}

export default async function WorkspaceLayout({
  params,
  children,
}: PropsWithChildren<WorkspaceProps>) {
  const workspace = {
    id: "abc",
    name: "Test",
    projectType: "uml-class-diagram",
  };
  //TODO add not-found
  if (!workspace) return;

  return (
    <Providers projectType={workspace.projectType} workspaceId={params.id}>
      <div className="grid h-full w-full grid-cols-[1fr,3fr,1fr]">
        <aside className="border-r-2 border-gray-400">
          <NodeList className="p-4" />
        </aside>
        <main>{children}</main>
        <aside className="w-full overflow-hidden border-l-2 border-gray-400 p-4">
          <EditorTree />
        </aside>
      </div>
    </Providers>
  );
}
