// layout-builder/AdvancedLayoutBuilder.tsx
import React, { useState, useCallback, useMemo } from "react";
import { Plus } from "lucide-react";
import type { LayoutArea, AreaConfig } from "@/types/advanced-template-types";
import type { 
  AdvancedLayoutBuilderProps, 
  DragConfig, 
  SectionWithPlacement 
} from "./types";
import {
  addPlacement,
  removePlacement,
  moveSection,
  groupSectionsByArea,
  calculateAdjustedIndex,
} from "./helpers";
import { DEFAULT_AREAS, LAYOUT_AREAS, GRID_LAYOUT_STYLE } from "./constants";
import { AvailableSectionCard } from "./AvailableSectionCard";
import { DropArea } from "./DropArea";

/**
 * Componente principal del constructor de layouts avanzado.
 * Permite organizar secciones mediante drag & drop en diferentes áreas del layout.
 */
export function AdvancedLayoutBuilder({
  template,
  sections: propSections,
  onSectionsChange,
  onLayoutChange,
  layoutStructure,
  onPreview,
  onSave,
  onReset,
  config,
  onConfigUpdate,
}: AdvancedLayoutBuilderProps) {
  // Estado de las áreas del layout
  const [areas, setAreas] = useState<Record<LayoutArea, AreaConfig>>(() => {
    const structure = layoutStructure ?? template?.layoutStructure;
    return structure?.areas || DEFAULT_AREAS;
  });

  // Estado de las secciones con información de placement
  const [sections, setSections] = useState<SectionWithPlacement[]>(() => {
    if (propSections && propSections.length > 0) {
      return addPlacement(propSections);
    }
    
    // Secciones por defecto si no hay props
    return addPlacement([
      {
        id: "1",
        name: "Sobre mí",
        type: "about",
        icon: "👤",
        area: "main",
        order: 1,
        enabled: true,
        config: {},
      },
      {
        id: "2",
        name: "Proyectos",
        type: "projects",
        icon: "💼",
        area: "main",
        order: 2,
        enabled: true,
        config: {},
      },
      {
        id: "3",
        name: "Habilidades",
        type: "skills",
        icon: "⚡",
        area: "main",
        order: 3,
        enabled: true,
        config: {},
      },
      {
        id: "4",
        name: "Contacto",
        type: "contact",
        icon: "📧",
        area: "floating",
        order: 0,
        enabled: false,
        config: {},
      },
      {
        id: "5",
        name: "Testimonios",
        type: "testimonials",
        icon: "💬",
        area: "floating",
        order: 0,
        enabled: false,
        config: {},
      },
    ]);
  });

  // Estado del drag & drop
  const [dragConfig, setDragConfig] = useState<DragConfig>({
    draggedItem: null,
    dragOverArea: null,
    dragOverIndex: null,
  });

  // Memoización de secciones filtradas
  const unplacedSections = useMemo(
    () => sections.filter((s) => s.placement === "unplaced"),
    [sections]
  );

  const placedSections = useMemo(
    () => sections.filter((s) => s.placement === "placed"),
    [sections]
  );

  const sectionsByArea = useMemo(
    () => groupSectionsByArea(placedSections),
    [placedSections]
  );

  // Handlers de drag & drop
  const beginDrag = useCallback(
    (e: React.DragEvent<HTMLDivElement>, section: SectionWithPlacement) => {
      try {
        e.dataTransfer.effectAllowed = "move";
        e.dataTransfer.setData("text/plain", section.id);
      } catch {}
      setDragConfig((prev) => ({ ...prev, draggedItem: section }));
    },
    []
  );

  const endDrag = useCallback(() => {
    setDragConfig({
      draggedItem: null,
      dragOverArea: null,
      dragOverIndex: null,
    });
  }, []);

  const handleDragOverArea = useCallback(
    (e: React.DragEvent<HTMLDivElement>, area: LayoutArea) => {
      e.preventDefault();
      try {
        e.dataTransfer.dropEffect = "move";
      } catch {}
      setDragConfig((prev) => ({
        ...prev,
        dragOverArea: area,
        dragOverIndex: null,
      }));
    },
    []
  );

  const handleDragOverRow = useCallback(
    (e: React.DragEvent<HTMLDivElement>, rowSection: SectionWithPlacement) => {
      e.preventDefault();
      e.stopPropagation();

      const area = rowSection.area;
      const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
      const y = e.clientY - rect.top;
      const before = y < rect.height / 2;

      const areaList = (sectionsByArea[area] || []).sort(
        (a, b) => a.order - b.order
      );
      const rowIndex = areaList.findIndex((s) => s.id === rowSection.id);
      const insertIndex = before ? rowIndex : rowIndex + 1;

      setDragConfig((prev) => ({
        ...prev,
        dragOverArea: area,
        dragOverIndex: insertIndex,
      }));
    },
    [sectionsByArea]
  );

  const handleDragLeaveRow = useCallback(() => {
    setDragConfig((prev) => ({ ...prev, dragOverIndex: null }));
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>, targetArea: LayoutArea) => {
      e.preventDefault();
      e.stopPropagation();

      let draggedId: string | null = null;
      try {
        draggedId = e.dataTransfer.getData("text/plain") || null;
      } catch {}

      const finalDraggedId = draggedId || dragConfig.draggedItem?.id;
      if (!finalDraggedId) return;

      // Ajustar el índice si estamos moviendo dentro de la misma área
      const adjustedIndex = calculateAdjustedIndex(
        sections,
        finalDraggedId,
        targetArea,
        dragConfig.dragOverIndex
      );

      const next = moveSection(
        sections,
        finalDraggedId,
        targetArea,
        adjustedIndex
      );
      
      setSections(next);
      onSectionsChange(removePlacement(next));
      
      setDragConfig({
        draggedItem: null,
        dragOverArea: null,
        dragOverIndex: null,
      });
    },
    [dragConfig, sections, onSectionsChange]
  );

  // Handlers de áreas y secciones
  const handleAreaToggle = useCallback(
    (area: LayoutArea, enabled: boolean) => {
      const newAreas = {
        ...areas,
        [area]: { ...areas[area], enabled },
      };
      setAreas(newAreas);

      const structure = layoutStructure ?? template?.layoutStructure;
      onLayoutChange({
        ...structure,
        areas: newAreas,
      });
    },
    [areas, layoutStructure, template, onLayoutChange]
  );

  const handleSectionToggle = useCallback(
    (sectionId: string, enabled: boolean) => {
      const updated = sections.map((s) =>
        s.id === sectionId ? { ...s, enabled } : s
      );
      setSections(updated);
      onSectionsChange(removePlacement(updated));
    },
    [sections, onSectionsChange]
  );

  const handleRemoveSection = useCallback(
    (sectionId: string) => {
      const updated = sections.map((s) =>
        s.id === sectionId
          ? {
              ...s,
              placement: "unplaced" as const,
              enabled: false,
              area: "floating" as LayoutArea,
              order: 0,
            }
          : s
      );
      setSections(updated);
      onSectionsChange(removePlacement(updated));
    },
    [sections, onSectionsChange]
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Content */}
      <div className="max-w-7xl mx-auto p-6">
        <div className="space-y-6">
          <div className="space-y-6">
            {/* Editor de Layout - Grid de áreas */}
            <div className="bg-white border rounded-xl p-4 overflow-x-auto">
              <div
                className="grid gap-2 min-w-[900px]"
                style={GRID_LAYOUT_STYLE}
              >
                {LAYOUT_AREAS.map((area) => {
                  const areaSections = sectionsByArea[area] || [];
                  const areaConfig = areas[area];

                  return (
                    <div key={area} style={{ gridArea: area }}>
                      <DropArea
                        area={area}
                        sections={areaSections}
                        isActive={dragConfig.dragOverArea === area}
                        onDrop={handleDrop}
                        onDragOver={handleDragOverArea}
                        onDragLeave={() =>
                          setDragConfig((p) => ({
                            ...p,
                            dragOverIndex: null,
                          }))
                        }
                        onDragOverRow={handleDragOverRow}
                        onDragLeaveRow={handleDragLeaveRow}
                        onRowDragStart={beginDrag}
                        onRowDragEnd={endDrag}
                        areaConfig={areaConfig}
                        onAreaToggle={handleAreaToggle}
                        dragOverIndex={dragConfig.dragOverIndex}
                        draggedId={dragConfig.draggedItem?.id ?? null}
                        onRemove={handleRemoveSection}
                        onToggle={handleSectionToggle}
                      />
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Secciones Disponibles */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-medium text-gray-800">
                  Secciones Disponibles
                </h4>
                <span className="text-xs bg-gray-200 px-2 py-1 rounded-full">
                  ({unplacedSections.length})
                </span>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
                {unplacedSections.map((section) => (
                  <AvailableSectionCard
                    key={section.id}
                    section={section}
                    isDragging={dragConfig.draggedItem?.id === section.id}
                    onDragStart={beginDrag}
                    onDragEnd={endDrag}
                  />
                ))}

                {/* Botón para crear sección custom */}
                <button className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-blue-400 hover:bg-blue-50 transition-colors">
                  <Plus size={20} className="mx-auto mb-1 text-gray-400" />
                  <span className="text-xs text-gray-600">
                    Crear Sección Custom
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}