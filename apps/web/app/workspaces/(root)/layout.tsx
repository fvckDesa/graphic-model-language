import { PropsWithChildren } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getServerSession } from "next-auth";
import Link from "next/link";
import { Database, Home, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export default async function HomeLayout({ children }: PropsWithChildren) {
  const session = await getServerSession(authOptions);

  if (!session) {
    throw new Error("Not authenticated");
  }

  const name = session.user?.name ?? "Unknown";
  const image = session.user?.image ?? "";

  return (
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
          <Button variant="outline" asChild>
            <Link href="/workspaces/connect">
              <Plus className="mr-2 h-4 w-4" />
              <span>Connect</span>
            </Link>
          </Button>
          <Button asChild>
            <Link href="/workspaces/new">
              <Database className="mr-2 h-4 w-4" />
              <span>New</span>
            </Link>
          </Button>
          <Avatar>
            <AvatarImage src={image} alt={`${name} avatar`} />
            <AvatarFallback>{name[0]}</AvatarFallback>
          </Avatar>
        </div>
      </header>
      <div className="w-full flex-1 overflow-hidden">{children}</div>
    </div>
  );
}
