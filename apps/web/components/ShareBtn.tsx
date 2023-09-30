"use client";
import {
  ComponentPropsWithoutRef,
  ElementRef,
  MouseEvent,
  forwardRef,
  useState,
} from "react";
import { Button } from "./ui/button";
import { Loader2 } from "lucide-react";

interface ShareButton {
  id: string;
}

const ShareButton = forwardRef<
  ElementRef<typeof Button>,
  ShareButton & ComponentPropsWithoutRef<typeof Button>
>(({ id, onClick: onClickProp, children, ...props }, ref) => {
  const [isLoading, setIsLoading] = useState(false);

  async function onClick(e: MouseEvent<HTMLButtonElement>) {
    onClickProp?.(e);
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
    <Button ref={ref} onClick={onClick} {...props}>
      {isLoading ? <Loader2 className="animate-spin" /> : children}
    </Button>
  );
});

ShareButton.displayName = "ShareButton";

export default ShareButton;
