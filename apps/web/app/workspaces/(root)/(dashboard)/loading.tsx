import { Skeleton } from "@/components/ui/skeleton";

const NUM_SKELETONS = 8;

export default function WorkspacesLoader() {
  return (
    <div className="space-y-4">
      {Array.from({ length: NUM_SKELETONS }).map((_, idx) => (
        <div key={idx} className="h-16 w-full space-y-2">
          <Skeleton className="h-4 w-[250px] max-w-full rounded" />
          <Skeleton className="h-4 w-[200px] max-w-full rounded" />
        </div>
      ))}
    </div>
  );
}
