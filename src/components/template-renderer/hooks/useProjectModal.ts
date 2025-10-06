// src/components/template-renderer/hooks/useProjectModal.ts
import { useState } from "react";
import type { Project } from "../../../types/portfolio-types";

export function useProjectModal() {
  const [selected, setSelected] = useState<Project | null>(null);

  const openProject = (project: Project) => {
    setSelected(project);
  };

  const closeProject = () => {
    setSelected(null);
  };

  return {
    selected,
    openProject,
    closeProject,
  };
}