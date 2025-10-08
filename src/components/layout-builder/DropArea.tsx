// layout-builder/DropArea.tsx
import React from "react";
import { Plus } from "lucide-react";
import type { DropAreaProps } from "./types";
import { AreaSectionRow } from "./AreaSectionRow";
import { AREA_NAMES, AREA_ICONS } from "./constants";

/**
 * Componente que representa un área donde se pueden soltar secciones
 * mediante drag & drop. Muestra las secciones contenidas y permite
 * reordenarlas.
 */
export const DropArea: React.FC<DropAreaProps> = ({
  area,
  sections,
  isActive,
  onDrop,
  onDragOver,
  onDragLeave,
  onDragOverRow,
  onDragLeaveRow,
  onRowDragStart,
  onRowDragEnd,
  areaConfig,
  onAreaToggle,
  dragOverIndex,
  draggedId,
  onRemove,
  onToggle,
}) => {
  return (
    <div
      onDrop={(e) => onDrop(e, area)}
      onDragOver={(e) => onDragOver(e, area)}
      onDragLeave={onDragLeave}
      className={`
        min-h-[110px] border-2 border-dashed rounded-lg p-4 transition-all
        ${isActive ? "border-blue-500 bg-blue-50" : "border-gray-300"}
        ${!areaConfig?.enabled ? "opacity-50" : ""}
      `}
    >
      {/* Header del área */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-xl">{AREA_ICONS[area]}</span>
          <h3 className="font-medium text-gray-800">{AREA_NAMES[area]}</h3>
          <span className="text-xs text-gray-500">({sections.length})</span>
        </div>

        {/* Control para activar/desactivar el área */}
        <div className="flex items-center gap-2">
          <label className="flex items-center gap-1 text-xs">
            <input
              type="checkbox"
              checked={areaConfig?.enabled || false}
              onChange={(e) => onAreaToggle(area, e.target.checked)}
              className="rounded"
            />
            Activa
          </label>
        </div>
      </div>

      {/* Contenido del área */}
      <div className="space-y-2">
        {sections.length === 0 ? (
          // Estado vacío
          <div className="text-center text-gray-400 py-4">
            <Plus size={24} className="mx-auto mb-2 opacity-50" />
            <p className="text-sm">Arrastra secciones aquí</p>
          </div>
        ) : (
          // Lista de secciones
          sections
            .sort((a, b) => a.order - b.order)
            .map((section, i) => {
              const isDragged = draggedId === section.id;
              const isBefore = dragOverIndex === i && !isDragged;
              const isAfter = dragOverIndex === i + 1 && !isDragged;

              return (
                <AreaSectionRow
                  key={section.id}
                  section={section}
                  isDragOverBefore={!!isBefore}
                  isDragOverAfter={!!isAfter}
                  onDragStart={onRowDragStart}
                  onDragEnd={onRowDragEnd}
                  onDragOverRow={onDragOverRow}
                  onDragLeaveRow={onDragLeaveRow}
                  onRemove={onRemove}
                  onToggle={onToggle}
                />
              );
            })
        )}
      </div>
    </div>
  );
};