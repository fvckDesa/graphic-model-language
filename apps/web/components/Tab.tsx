"use client";
import { cn } from "cn";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ComponentPropsWithoutRef, ElementRef, forwardRef } from "react";

interface TabProps {
  pathname: string;
}

const Tab = forwardRef<
  ElementRef<typeof Link>,
  TabProps & Omit<ComponentPropsWithoutRef<typeof Link>, "href">
>(({ pathname: pathnameProp, className, children, ...props }, ref) => {
  const pathname = usePathname();

  return (
    <Link
      ref={ref}
      href={pathnameProp}
      className={cn(
        "hover:bg-accent flex cursor-pointer items-center gap-2 rounded px-4 py-2 transition-colors",
        {
          "bg-accent text-primary font-bold":
            trailingSlashPath(pathname) === trailingSlashPath(pathnameProp),
        },
        className
      )}
      {...props}
    >
      {children}
    </Link>
  );
});

Tab.displayName = "Tab";

export default Tab;

function trailingSlashPath(path: string) {
  return path.endsWith("/") ? path : `${path}/`;
}
