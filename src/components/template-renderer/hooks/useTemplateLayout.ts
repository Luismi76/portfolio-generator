// src/components/template-renderer/hooks/useTemplateLayout.ts
import { useMemo } from "react";
import type {
  AdvancedTemplate,
  Section as AdvSection,
  LayoutArea,
} from "../../../types/advanced-template-types";

export function useTemplateLayout(
  template?: AdvancedTemplate,
  byArea?: Record<LayoutArea, AdvSection[]>
) {
  const structure = template?.layoutStructure;

  const leftEnabled = useMemo(() => {
    if (!byArea) return false;
    return (
      structure?.areas?.["sidebar-left"]?.enabled !== false &&
      byArea["sidebar-left"].length > 0
    );
  }, [structure, byArea]);

  const rightEnabled = useMemo(() => {
    if (!byArea) return false;
    return (
      structure?.areas?.["sidebar-right"]?.enabled !== false &&
      byArea["sidebar-right"].length > 0
    );
  }, [structure, byArea]);

  const leftWidth = structure?.areas?.["sidebar-left"]?.width || "260px";
  const rightWidth = structure?.areas?.["sidebar-right"]?.width || "280px";

  const gridTemplateColumns = useMemo(() => {
    if (leftEnabled && rightEnabled) {
      return `${leftWidth} minmax(0,1fr) ${rightWidth}`;
    }
    if (leftEnabled) {
      return `${leftWidth} minmax(0,1fr)`;
    }
    if (rightEnabled) {
      return `minmax(0,1fr) ${rightWidth}`;
    }
    return `minmax(0,1fr)`;
  }, [leftEnabled, rightEnabled, leftWidth, rightWidth]);

  return {
    leftEnabled,
    rightEnabled,
    leftWidth,
    rightWidth,
    gridTemplateColumns,
  };
}