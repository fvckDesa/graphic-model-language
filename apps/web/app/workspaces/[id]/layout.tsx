import "./editor.css";

import { PropsWithChildren } from "react";
import Providers from "@/components/Providers";
import NodeList from "@/components/NodeList";
import EditorTree from "@/components/EditorTree";
import { ScrollArea } from "@/components/ui/scroll-area";
import { prisma } from "database/client";
import { notFound } from "next/navigation";

interface WorkspaceProps {
  params: { id: string };
}

export default async function WorkspaceLayout({
  params,
  children,
}: PropsWithChildren<WorkspaceProps>) {
  const workspace = await prisma.workspace.findUnique({
    where: {
      id: params.id,
    },
  });

  if (!workspace) {
    notFound();
  }

  return (
    <Providers projectType={workspace.projectType} workspaceId={params.id}>
      <div className="grid h-full w-full grid-cols-[1fr,3fr,1fr]">
        <aside className="h-full w-full overflow-hidden border-r-2 border-gray-400">
          <ScrollArea type="auto" className="h-full w-full p-4">
            <NodeList />
          </ScrollArea>
        </aside>
        <main>{children}</main>
        <aside className="h-full w-full overflow-hidden border-l-2 border-gray-400">
          <ScrollArea type="auto" className="h-full w-full p-4">
            <EditorTree />
          </ScrollArea>
        </aside>
      </div>
    </Providers>
  );
}
