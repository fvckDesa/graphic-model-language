import { ScrollArea } from "@/components/ui/scroll-area";
import Tab from "@/components/Tab";
import { PropsWithChildren } from "react";
import { Database } from "lucide-react";

export default function HomeLayout({ children }: PropsWithChildren) {
  return (
    <div className="flex h-full w-full">
      <aside className="border-border h-full w-1/3 max-w-[200px] border-r-2">
        <nav className="px-2 py-4">
          <Tab pathname="/workspaces/">
            <Database />
            <span>My Workspaces</span>
          </Tab>
        </nav>
      </aside>
      <ScrollArea className="flex-1 p-6">
        <div className="mx-auto w-full max-w-xl">{children}</div>
      </ScrollArea>
    </div>
  );
}
