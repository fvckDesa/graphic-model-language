import { prisma, UserType } from "database/client";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default async function Home() {
  const session = await getServerSession(authOptions);

  if (!session) {
    throw new Error("Not authenticated");
  }

  const workspaces = await prisma.workspace.findMany({
    where: {
      users: {
        some: {
          AND: {
            type: UserType.Owner,
            userId: session.user.id,
          },
        },
      },
    },
  });

  return (
    <>
      {workspaces.length > 0 ? (
        <ul className="space-y-4">
          {workspaces.map(({ id, name, projectType }) => (
            <li
              key={id}
              className="border-border w-full cursor-pointer rounded border"
            >
              <Link href={`/workspaces/${id}`} className="block px-4 py-2">
                <h1>{name}</h1>
                <h3>{projectType}</h3>
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <div className="mt-12 flex flex-col items-center gap-8">
          <h1 className="text-3xl font-bold">Start with Workspaces</h1>
          <p className="text-primary/70 text-center font-semibold">
            <span>A workspace lets you work on one type of project</span>
            <br />
            <span>with whoever you want</span>
          </p>
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
