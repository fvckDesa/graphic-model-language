import { prisma, UserType } from "database/client";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  WorkspaceItem,
  WorkspaceItemShare,
  WorkspaceItemDelete,
} from "@/components/workspace-item";
import { Plus } from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "My Workspaces",
};

export default async function Home() {
  const session = await getServerSession(authOptions);

  if (!session) {
    throw new Error("Not authenticated");
  }

  const workspaces = await prisma.workspace.findMany({
    where: {
      users: {
        some: {
          type: UserType.Owner,
          userId: session.user.id,
        },
      },
    },
  });

  return (
    <>
      {workspaces.length > 0 ? (
        <ul className="space-y-4">
          {workspaces.map(({ id, name, projectType }) => (
            <WorkspaceItem key={id} id={id}>
              <div>
                <h1>{name}</h1>
                <h3>{projectType}</h3>
              </div>
              <div className="flex gap-2">
                <WorkspaceItemShare />
                <WorkspaceItemDelete />
              </div>
            </WorkspaceItem>
          ))}
        </ul>
      ) : (
        <div className="mt-12 flex flex-col items-center gap-8">
          <header className="text-center">
            <h1 className="text-3xl font-bold">Start with Workspaces</h1>
            <p className="text-muted-foreground font-semibold">
              <span>A workspace lets you work on one type of project</span>
              <br />
              <span>with whoever you want</span>
            </p>
          </header>
          <Button asChild>
            <Link href="/workspaces/new">
              <Plus className="mr-2 h-4 w-4" />
              <span>Create a Workspace</span>
            </Link>
          </Button>
        </div>
      )}
    </>
  );
}
