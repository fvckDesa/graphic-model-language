"use client";
import { useRouter } from "next/navigation";
import {
  MouseEvent,
  PropsWithChildren,
  createContext,
  useContext,
  useState,
} from "react";
import { Button } from "./ui/button";
import { Loader2, Share2, Trash2 } from "lucide-react";

interface WorkspaceItemContextProps {
  id: string;
}

const WorkspaceItemContext = createContext<WorkspaceItemContextProps | null>(
  null
);

function useWorkspaceItem() {
  const ctx = useContext(WorkspaceItemContext);
  if (!ctx) {
    throw new Error(
      "'useWorkspaceItem' need to be wrap in a 'WorkspaceItemProvider'"
    );
  }

  return ctx;
}

export function WorkspaceItem({
  id,
  children,
}: PropsWithChildren<WorkspaceItemContextProps>) {
  const router = useRouter();

  function onClick() {
    router.push(`/workspaces/${id}`);
  }

  return (
    <WorkspaceItemContext.Provider value={{ id }}>
      <li
        className="border-border flex w-full cursor-pointer items-center justify-between rounded border px-4 py-2"
        onClick={onClick}
      >
        {children}
      </li>
    </WorkspaceItemContext.Provider>
  );
}

export function WorkspaceItemShare() {
  const { id } = useWorkspaceItem();
  const [isLoading, setIsLoading] = useState(false);

  async function onClick(e: MouseEvent) {
    e.stopPropagation();
    setIsLoading(true);
    try {
      await navigator.clipboard.writeText(
        `${window.origin}/workspaces/connect?${new URLSearchParams({
          id,
        })}`
      );
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Button variant="ghost" size="icon" onClick={onClick}>
      {isLoading ? <Loader2 className="animate-spin" /> : <Share2 />}
    </Button>
  );
}

export function WorkspaceItemDelete() {
  const { id } = useWorkspaceItem();
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  async function onClick(e: MouseEvent) {
    e.stopPropagation();
    setIsLoading(true);
    try {
      await fetch("/api/workspaces/delete", {
        method: "POST",
        body: JSON.stringify({ id }),
        cache: "no-store",
      });
      router.refresh();
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Button variant="ghost" size="icon" onClick={onClick}>
      {isLoading ? <Loader2 className="animate-spin" /> : <Trash2 />}
    </Button>
  );
}
