"use client";
import { PropsWithChildren } from "react";
import { ReactFlowProvider } from "reactflow";

function Providers({ children }: PropsWithChildren) {
  return <ReactFlowProvider>{children}</ReactFlowProvider>;
}

export default Providers;
