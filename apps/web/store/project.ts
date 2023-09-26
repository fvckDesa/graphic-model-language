import { atom } from "jotai";
import { Project, importProject } from "projects";

const isSSR = typeof window === "undefined";

export const projectType = atom<string | null>(null);

export const project = atom<Project>((get) => {
  const type = get(projectType);

  if (isSSR || !type) {
    return {};
  }

  return importProject(type);
});
