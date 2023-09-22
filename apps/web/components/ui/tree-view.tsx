import { cn } from "cn";
import {
  createContext,
  useContext,
  forwardRef,
  ElementRef,
  ComponentPropsWithoutRef,
  useMemo,
  Children,
  isValidElement,
  ReactNode,
} from "react";

interface TreeViewContextProps {
  direction: "left" | "right";
}

const TreeViewContext = createContext<TreeViewContextProps>({
  direction: "left",
});

export const TreeView = forwardRef<
  ElementRef<"ul">,
  ComponentPropsWithoutRef<"ul"> & Partial<TreeViewContextProps>
>(({ direction = "left", children, ...subTreeProps }, ref) => {
  return (
    <TreeViewContext.Provider value={{ direction }}>
      <SubTree ref={ref} {...subTreeProps}>
        {children}
      </SubTree>
    </TreeViewContext.Provider>
  );
});

TreeView.displayName = "TreeView";

interface LeafContextProps {
  depth: number;
}

const LeafContext = createContext<LeafContextProps>({ depth: 0 });

export const SubTree = forwardRef<
  ElementRef<"ul">,
  ComponentPropsWithoutRef<"ul">
>(({ children, className, ...ulProps }, ref) => {
  return (
    <ul ref={ref} className={cn(className, "flex flex-col p-0")} {...ulProps}>
      {children}
    </ul>
  );
});

SubTree.displayName = "SubTree";

export const TreeLeaf = forwardRef<
  ElementRef<"li">,
  ComponentPropsWithoutRef<"li">
>(({ children, className, style = {}, ...liProps }, ref) => {
  const { depth } = useContext(LeafContext);
  const { direction } = useContext(TreeViewContext);
  const { visual, action, subTree } = useSubTree(children);

  return (
    <LeafContext.Provider value={{ depth: depth + 1 }}>
      <li
        ref={ref}
        className={cn(className, "flex-1", {
          "pl-2": direction === "left",
          "pr-2": direction === "right",
        })}
        {...liProps}
      >
        <div className="flex items-center justify-between">
          <span>{visual}</span>
          <span>{action}</span>
        </div>
        {subTree}
      </li>
    </LeafContext.Provider>
  );
});

TreeLeaf.displayName = "TreeLeaf";

export const TreeVisual = forwardRef<
  ElementRef<"div">,
  ComponentPropsWithoutRef<"div">
>(({ children, ...divProps }, ref) => {
  return (
    <div ref={ref} {...divProps}>
      {children}
    </div>
  );
});

TreeVisual.displayName = "TreeVisual";

export const TreeAction = forwardRef<
  ElementRef<"div">,
  ComponentPropsWithoutRef<"div">
>(({ children, ...divProps }, ref) => {
  return (
    <div ref={ref} {...divProps}>
      {children}
    </div>
  );
});

TreeAction.displayName = "TreeAction";

function useSubTree(children: ReactNode) {
  return useMemo(() => {
    const visual = Children.toArray(children).find(
      (child) => isValidElement(child) && child.type === TreeVisual
    );

    const action = Children.toArray(children).find(
      (child) => isValidElement(child) && child.type === TreeAction
    );

    const subTree = Children.toArray(children).find(
      (child) => isValidElement(child) && child.type === SubTree
    );
    return { visual, action, subTree };
  }, [children]);
}
