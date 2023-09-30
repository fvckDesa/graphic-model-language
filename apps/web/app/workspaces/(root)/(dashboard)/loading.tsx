import { Skeleton } from "@/components/ui/skeleton";

const NUM_SKELETONS = 5;

export default function WorkspacesLoader() {
  return (
    <div className="space-y-4">
      {Array.from({ length: NUM_SKELETONS }).map((_, idx) => (
        <Skeleton key={idx} className="h-16 w-full rounded" />
      ))}
    </div>
  );
}
