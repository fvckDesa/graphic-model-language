import { prisma, UserType } from "database/client";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { NextRequest, NextResponse } from "next/server";
import { Value } from "@sinclair/typebox/value";
import { NewWorkspaceSchema } from "@/lib/schema";

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Not Authorized" }, { status: 401 });
  }

  const newWorkspace = await request.json();

  if (!Value.Check(NewWorkspaceSchema, newWorkspace)) {
    return NextResponse.json(
      { error: "Bad request, invalid data" },
      { status: 400 }
    );
  }

  const { name, project } = newWorkspace;

  const workspace = await prisma.workspace.create({
    data: {
      name,
      projectType: project,
      users: {
        create: {
          type: UserType.Owner,
          user: {
            connect: {
              id: session.user.id,
            },
          },
        },
      },
    },
  });

  return NextResponse.json(workspace, { status: 200 });
}
