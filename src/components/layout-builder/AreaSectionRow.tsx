// layout-builder/AreaSectionRow.tsx
import React from "react";
import { Eye, EyeOff, Menu, X } from "lucide-react";
import type { AreaSectionRowProps } from "./types";

/**
 * Componente que representa una fila de sección dentro de un área del layout.
 * Puede ser arrastrada para reordenar y tiene controles para ocultar/mostrar y remover.
 */
export const AreaSectionRow: React.FC<AreaSectionRowProps> = ({
  section,
  isDragOverBefore,
  isDragOverAfter,
  onDragStart,
  onDragEnd,
  onDragOverRow,
  onDragLeaveRow,
  onRemove,
  onToggle,
}) => {
  return (
    <div
      draggable
      onDragStart={(e) => onDragStart(e, section)}
      onDragEnd={onDragEnd}
      onDragOver={(e) => onDragOverRow(e, section)}
      onDragLeave={onDragLeaveRow}
      className={`
        relative bg-gray-50 rounded p-2 text-sm border transition-colors cursor-move
        ${section.enabled ? "border-green-200 bg-green-50" : "border-gray-200"}
      `}
    >
      {/* Indicador de drop antes */}
      {isDragOverBefore && (
        <div className="absolute -top-1 left-0 right-0 h-0.5 bg-blue-500 rounded-full" />
      )}
      
      {/* Indicador de drop después */}
      {isDragOverAfter && (
        <div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-blue-500 rounded-full" />
      )}

      <div className="flex items-center justify-between">
        {/* Información de la sección */}
        <div className="flex items-center gap-2">
          <Menu
            size={14}
            className="text-gray-400 cursor-grab active:cursor-grabbing"
          />
          <span>{section.icon}</span>
          <span className="font-medium">{section.name}</span>
        </div>

        {/* Controles */}
        <div className="flex items-center gap-1">
          {/* Botón toggle visibilidad */}
          <button
            onClick={() => onToggle(section.id, !section.enabled)}
            className={`p-1 rounded ${
              section.enabled
                ? "text-green-600 hover:bg-green-100"
                : "text-gray-400 hover:bg-gray-100"
            }`}
            title={section.enabled ? "Ocultar" : "Mostrar"}
          >
            {section.enabled ? <Eye size={12} /> : <EyeOff size={12} />}
          </button>

          {/* Botón remover */}
          <button
            onClick={() => onRemove(section.id)}
            className="p-1 text-orange-600 hover:bg-orange-100 rounded"
            title="Mover a disponibles"
          >
            <X size={12} />
          </button>

          {/* Indicador de orden */}
          <span className="text-xs text-gray-500">#{section.order}</span>
        </div>
      </div>
    </div>
  );
};