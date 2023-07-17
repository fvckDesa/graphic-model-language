import Providers from "@/components/Providers";
import Workspace from "@/components/Workspace";
import DragElement from "@/components/DragElement";

interface NodeItem {
  type: string;
  label: string;
  connections: string[];
}

const NodesIds: NodeItem[] = [
  { type: "input", label: "input", connections: ["default", "output"] },
  { type: "default", label: "neutral", connections: ["default", "output"] },
  { type: "output", label: "output", connections: [] },
];

export default function Home() {
  return (
    <Providers>
      <div className="grid h-full w-full grid-cols-[1fr,3fr]">
        <aside className="border-r-2 border-gray-400 p-4">
          {NodesIds.map(({ type, label, connections }) => (
            <DragElement
              key={label}
              className="mb-2 flex cursor-grab items-center justify-center border border-gray-400 px-3 py-1"
              data={{
                type,
                data: { label, connections },
                width: 150,
                height: 40,
              }}
              type="application/node"
            >
              {label}
            </DragElement>
          ))}
        </aside>
        <main>
          <Workspace />
        </main>
      </div>
    </Providers>
  );
}
