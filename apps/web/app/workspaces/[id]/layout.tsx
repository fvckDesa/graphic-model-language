import "./editor.css";

import { PropsWithChildren } from "react";
import Providers from "@/components/Providers";
import NodeList from "@/components/NodeList";
import EditorTree from "@/components/EditorTree";
import { ScrollArea } from "@/components/ui/scroll-area";
import { prisma } from "database/client";
import { notFound } from "next/navigation";
import Zoom from "@/components/Zoom";
import Link from "next/link";
import { Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import ShareButton from "@/components/ShareBtn";
import OnlineUsers from "@/components/OnlineUsers";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

interface WorkspaceProps {
  params: { id: string };
}

export default async function WorkspaceLayout({
  params,
  children,
}: PropsWithChildren<WorkspaceProps>) {
  const session = await getServerSession(authOptions);

  if (!session) {
    throw new Error("Not Authenticated");
  }

  const workspace = await prisma.workspace.findUnique({
    where: {
      id: params.id,
    },
  });

  if (!workspace) {
    notFound();
  }

  return (
    <Providers
      projectType={workspace.projectType}
      workspaceId={params.id}
      session={session}
    >
      <div className="flex h-full w-full flex-col items-center justify-center">
        <header className="border-border flex w-full items-center justify-between border-b-2 px-6 py-2">
          <div>
            <Button variant="ghost" size="icon" asChild>
              <Link href="/workspaces">
                <Home />
              </Link>
            </Button>
          </div>
          <div className="flex gap-4">
            <OnlineUsers />
            <ShareButton id={params.id}>Share</ShareButton>
            <Zoom />
          </div>
        </header>
        <div className="grid h-full w-full flex-1 grid-cols-[1fr,3fr,1fr] overflow-hidden">
          <aside className="border-border h-full w-full overflow-hidden border-r-2">
            <ScrollArea type="auto" className="h-full w-full p-4">
              <NodeList />
            </ScrollArea>
          </aside>
          <main>{children}</main>
          <aside className="border-border h-full w-full overflow-hidden border-l-2">
            <ScrollArea type="auto" className="h-full w-full p-4">
              <EditorTree />
            </ScrollArea>
          </aside>
        </div>
      </div>
    </Providers>
  );
}
