// EditableItem.tsx - VERSIÓN CORREGIDA
import React from 'react';
import { Trash2Icon } from './portfolio-icons'; // ✅ Import directo del componente
import { EditableItemProps } from '../types/portfolio-types';

export const EditableItem: React.FC<EditableItemProps> = ({ 
  index, 
  onRemove, 
  showRemoveButton = true, 
  title, 
  children, 
  className = "" 
}) => {
  return (
    <div className={`border border-gray-200 rounded-lg p-4 ${className}`}>
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-medium text-gray-800">{title}</h3>
        {showRemoveButton && onRemove && (
          <button
            onClick={() => onRemove(index)}
            className="flex items-center gap-1 px-2 py-1 text-red-600 hover:text-red-800 hover:bg-red-50 rounded text-sm transition-colors"
            title="Eliminar elemento"
          >
            <Trash2Icon size={14} />
            Eliminar
          </button>
        )}
      </div>
      {children}
    </div>
  );
};