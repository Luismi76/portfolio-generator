// layout-builder/types.ts
import type { Section, AreaConfig, LayoutArea } from "@/types/advanced-template-types";

/**
 * Estado de colocación de una sección
 */
export type SectionPlacement = "unplaced" | "placed";

/**
 * Sección con información de colocación
 */
export interface SectionWithPlacement extends Section {
  placement: SectionPlacement;
}

/**
 * Configuración del estado de drag & drop
 */
export interface DragConfig {
  draggedItem: SectionWithPlacement | null;
  dragOverArea: LayoutArea | null;
  dragOverIndex: number | null;
}

/**
 * Props para AvailableSectionCard
 */
export interface AvailableSectionCardProps {
  section: SectionWithPlacement;
  isDragging: boolean;
  onDragStart: (
    e: React.DragEvent<HTMLDivElement>,
    section: SectionWithPlacement
  ) => void;
  onDragEnd: () => void;
}

/**
 * Props para AreaSectionRow
 */
export interface AreaSectionRowProps {
  section: SectionWithPlacement;
  isDragOverBefore: boolean;
  isDragOverAfter: boolean;
  onDragStart: (
    e: React.DragEvent<HTMLDivElement>,
    section: SectionWithPlacement
  ) => void;
  onDragEnd: () => void;
  onDragOverRow: (
    e: React.DragEvent<HTMLDivElement>,
    section: SectionWithPlacement
  ) => void;
  onDragLeaveRow: () => void;
  onRemove: (id: string) => void;
  onToggle: (id: string, enabled: boolean) => void;
}

/**
 * Props para DropArea
 */
export interface DropAreaProps {
  area: LayoutArea;
  sections: SectionWithPlacement[];
  isActive: boolean;
  onDrop: (e: React.DragEvent<HTMLDivElement>, area: LayoutArea) => void;
  onDragOver: (e: React.DragEvent<HTMLDivElement>, area: LayoutArea) => void;
  onDragLeave: () => void;
  onDragOverRow: (
    e: React.DragEvent<HTMLDivElement>,
    section: SectionWithPlacement
  ) => void;
  onDragLeaveRow: () => void;
  onRowDragStart: (
    e: React.DragEvent<HTMLDivElement>,
    section: SectionWithPlacement
  ) => void;
  onRowDragEnd: () => void;
  areaConfig: AreaConfig;
  onAreaToggle: (area: LayoutArea, enabled: boolean) => void;
  dragOverIndex: number | null;
  draggedId: string | null;
  onRemove: (id: string) => void;
  onToggle: (id: string, enabled: boolean) => void;
}

/**
 * Props principales del componente AdvancedLayoutBuilder
 */
export interface AdvancedLayoutBuilderProps {
  template: any;
  sections: Section[];
  onSectionsChange: (sections: Section[]) => void;
  onLayoutChange: (structure: any) => void;
  layoutStructure?: any;
  onPreview?: () => void;
  onSave?: () => void;
  onReset?: () => void;
  config?: any;
  onConfigUpdate?: (updates: any) => void;
}