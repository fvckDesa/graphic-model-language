import { ScrollArea } from "@/components/ui/scroll-area";
import Tab from "@/components/Tab";
import { PropsWithChildren } from "react";
import { Database, Repeat2 } from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    template: "%s | Dashboard",
    default: "Dashboard",
  },
};

export default function HomeLayout({ children }: PropsWithChildren) {
  return (
    <div className="flex h-full w-full">
      <aside className="border-border h-full w-1/3 max-w-[200px] border-r-2">
        <nav className="space-y-2 px-2 py-4">
          <Tab pathname="/workspaces/">
            <Database />
            <span>My Workspaces</span>
          </Tab>
          <Tab pathname="/workspaces/shared">
            <Repeat2 />
            <span>Shared</span>
          </Tab>
        </nav>
      </aside>
      <div className="h-full flex-1">
        <ScrollArea type="auto" className="h-full w-full p-6">
          <div className="mx-auto w-full max-w-xl">{children}</div>
        </ScrollArea>
      </div>
    </div>
  );
}
