import { PropsWithChildren } from "react";
import Providers from "@/components/Providers";
import NodeList from "@/components/NodeList";
import { prisma } from "database/client";

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
    include: {
      nodes: true,
      edges: true,
    },
  });
  //TODO add not-found
  if (!workspace) return;

  return (
    <Providers projectType={workspace.projectType} workspaceId={params.id}>
      <div className="grid h-full w-full grid-cols-[1fr,3fr]">
        <aside className="border-r-2 border-gray-400">
          <NodeList className="p-4" />
        </aside>
        <main>{children}</main>
      </div>
    </Providers>
  );
}
