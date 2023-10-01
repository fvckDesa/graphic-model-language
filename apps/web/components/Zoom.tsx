"use client";
import { ZoomIn, ZoomOut } from "lucide-react";
import { useReactFlow, useStore } from "reactflow";

function Zoom() {
  const { zoomIn, zoomOut } = useReactFlow();
  const { minZoomReached, zoom, maxZoomReached } = useStore((state) => ({
    minZoomReached: state.transform[2] <= state.minZoom,
    zoom: Math.round(state.transform[2] * 100),
    maxZoomReached: state.transform[2] >= state.maxZoom,
  }));

  return (
    <div className="border-border bg-background flex items-center overflow-hidden rounded-md border-2">
      <button
        className="hover:bg-accent hover:text-accent-foreground h-full w-8 p-2"
        onClick={() => zoomOut()}
        disabled={minZoomReached}
      >
        <ZoomOut size={16} />
      </button>
      <div className="w-16 border-x-2 px-2 py-1 text-center">{zoom}%</div>
      <button
        className="hover:bg-accent hover:text-accent-foreground h-full w-8 p-2"
        onClick={() => zoomIn()}
        disabled={maxZoomReached}
      >
        <ZoomIn size={16} />
      </button>
    </div>
  );
}

export default Zoom;
