// layout-builder/AvailableSectionCard.tsx
import React from "react";
import { Menu } from "lucide-react";
import type { AvailableSectionCardProps } from "./types";

/**
 * Componente que muestra una tarjeta de sección disponible
 * que puede ser arrastrada a las áreas del layout
 */
export const AvailableSectionCard: React.FC<AvailableSectionCardProps> = ({
  section,
  isDragging,
  onDragStart,
  onDragEnd,
}) => {
  return (
    <div
      draggable
      onDragStart={(e) => onDragStart(e, section)}
      onDragEnd={onDragEnd}
      className={`
        bg-white rounded-lg border-2 border-dashed p-3 cursor-move transition-all
        ${isDragging ? "opacity-50 scale-95" : "opacity-100 scale-100"}
        border-gray-200 hover:border-blue-400 hover:shadow-md
      `}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-lg">{section.icon}</span>
          <div>
            <div className="font-medium text-sm">{section.name}</div>
            <div className="text-xs text-gray-500">Sin colocar</div>
          </div>
        </div>
        <Menu size={16} className="text-gray-400" />
      </div>
    </div>
  );
};