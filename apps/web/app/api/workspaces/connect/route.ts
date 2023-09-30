import { prisma } from "database/client";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { NextRequest, NextResponse } from "next/server";
import { WorkspaceIdSchema } from "@/utils/workspace";
import { Value } from "@sinclair/typebox/value";

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Not Authorized" }, { status: 401 });
  }

  const workspaceId = await request.json();

  if (!Value.Check(WorkspaceIdSchema, workspaceId)) {
    return NextResponse.json(
      { error: "Bad request, invalid data" },
      { status: 400 }
    );
  }

  const workspace = await prisma.workspace.update({
    where: {
      id: workspaceId.id,
      NOT: {
        users: {
          some: {
            userId: session.user.id,
            workspaceId: workspaceId.id,
          },
        },
      },
    },
    data: {
      users: {
        create: {
          userId: session.user.id,
        },
      },
    },
  });

  return NextResponse.json(workspace, { status: 200 });
}
