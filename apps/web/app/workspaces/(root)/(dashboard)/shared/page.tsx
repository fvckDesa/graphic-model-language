import { prisma, UserType } from "database/client";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { WorkspaceItem, WorkspaceItemShare } from "@/components/workspace-item";
import { Plus } from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Shared",
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
          type: UserType.User,
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
              </div>
            </WorkspaceItem>
          ))}
        </ul>
      ) : (
        <div className="mt-12 flex flex-col items-center gap-8">
          <header className="text-center">
            <h1 className="text-3xl font-bold">Shared Workspaces</h1>
            <p className="text-muted-foreground font-semibold">
              Visualize all workspaces shared with you here
            </p>
          </header>
          <div className="flex w-fit flex-col items-center gap-4">
            <Button asChild>
              <Link href="/workspaces/connect">
                <Plus className="mr-2 h-4 w-4" />
                <span>Connect Workspace</span>
              </Link>
            </Button>
            <div className="relative w-full">
              <Separator className="my-2" />
              <div className="bg-background text-muted-foreground absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 px-1 text-center text-xs">
                OR
              </div>
            </div>
            <p className="text-muted-foreground text-center text-xs font-semibold">
              Ask the owner link
            </p>
          </div>
        </div>
      )}
    </>
  );
}
