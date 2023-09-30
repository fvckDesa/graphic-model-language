import { prisma, UserType } from "database/client";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { NextRequest, NextResponse } from "next/server";
import { Value } from "@sinclair/typebox/value";
import { DeleteWorkspaceSchema } from "@/utils/workspace";

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json(
      { error: "Not Authorized: not sign in" },
      { status: 401 }
    );
  }

  const deleteWorkspace = await request.json();

  if (!Value.Check(DeleteWorkspaceSchema, deleteWorkspace)) {
    return NextResponse.json(
      { error: "Bad request, invalid data" },
      { status: 400 }
    );
  }

  const workspace = await prisma.workspace.delete({
    where: {
      id: deleteWorkspace.id,
      users: {
        some: {
          userId: session.user.id,
          type: UserType.Owner,
        },
      },
    },
  });

  return NextResponse.json(workspace, { status: 200 });
}
