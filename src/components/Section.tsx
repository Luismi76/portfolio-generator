// Section.tsx
import React from 'react';
import { Icons } from './portfolio-icons';
import { SectionProps } from '../types/portfolio-types';

export const Section: React.FC<SectionProps> = ({
  title,
  children,
  onAdd,
  showAddButton = false,
  className = ""
}) => {
  return (
    <div className={`bg-white rounded-lg shadow-sm border p-6 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
        {showAddButton && onAdd && (
          <button
            onClick={onAdd}
            className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Icons.Plus size={16} />
            Añadir
          </button>
        )}
      </div>
      <div className="space-y-4">
        {children}
      </div>
    </div>
  );
};

