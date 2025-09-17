// Section.tsx
import React from 'react';
import { Icons } from './portfolio-icons';

interface SectionProps {
  title: string;
  description?: string;
  icon?: React.ComponentType<{ size?: number; className?: string }>;
  children: React.ReactNode;
  showAddButton?: boolean;
  onAdd?: () => void;
  addButtonText?: string;
  className?: string;
}

export const Section: React.FC<SectionProps> = ({
  title,
  description,
  icon: Icon,
  children,
  showAddButton = false,
  onAdd,
  addButtonText = "Añadir",
  className = ""
}) => {
  return (
    <div className={`bg-white rounded-lg shadow-sm p-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          {Icon && <Icon className="text-blue-600" size={20} />}
          <h2 className="text-lg font-semibold text-gray-800">{title}</h2>
        </div>
        
        {showAddButton && onAdd && (
          <button
            onClick={onAdd}
            className="flex items-center gap-1 bg-blue-600 text-white px-3 py-1 rounded-lg hover:bg-blue-700 text-sm transition-colors focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            <Icons.Plus size={16} />
            {addButtonText}
          </button>
        )}
      </div>

      {/* Description */}
      {description && (
        <p className="text-sm text-gray-600 mb-6">{description}</p>
      )}

      {/* Content */}
      {children}
    </div>
  );
};

export default Section;