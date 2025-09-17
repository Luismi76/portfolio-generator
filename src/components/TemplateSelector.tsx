// TemplateSelector.tsx
import React, { useState } from 'react';
import { Template } from '../types/template-types';
import { Icons } from './portfolio-icons';

interface TemplateSelectorProps {
  templates: Template[];
  selectedTemplate: Template | null;
  onSelectTemplate: (template: Template) => void;
  onCustomize?: () => void;
  onAddTemplate?: () => void;
}

interface TemplateCardProps {
  template: Template;
  isSelected: boolean;
  onSelect: () => void;
  onCustomize?: () => void;
}

const TemplateCard: React.FC<TemplateCardProps> = ({
  template,
  isSelected,
  onSelect,
  onCustomize
}) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className={`relative border-2 rounded-lg overflow-hidden cursor-pointer transition-all duration-300 ${
        isSelected 
          ? 'border-blue-500 ring-2 ring-blue-200 shadow-lg' 
          : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
      }`}
      onClick={onSelect}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Preview mockup */}
      <div className="aspect-video bg-gradient-to-br from-gray-50 to-gray-100 p-3 relative overflow-hidden">
        {/* Simulación visual de la plantilla con más detalle */}
        <div 
          className="w-full h-full rounded-md p-3 text-xs relative"
          style={{ 
            background: `linear-gradient(135deg, ${template.colors.background}, ${template.colors.surface})`,
          }}
        >
          {/* Header mockup con gradiente */}
          <div 
            className="absolute top-0 left-0 right-0 h-8 rounded-t-md p-2 flex items-center"
            style={{
              background: `linear-gradient(135deg, ${template.colors.primary}, ${template.colors.secondary})`
            }}
          >
            <div className="w-4 h-1 bg-white bg-opacity-80 rounded-full mr-2"></div>
            <div className="flex-1">
              <div className="h-1 bg-white bg-opacity-60 rounded mb-0.5" style={{ width: '60%' }}></div>
              <div className="h-0.5 bg-white bg-opacity-40 rounded" style={{ width: '40%' }}></div>
            </div>
          </div>
          
          {/* Content mockup */}
          <div className="mt-10 space-y-1">
            <div 
              className="h-1 rounded"
              style={{ backgroundColor: template.colors.primary, width: '80%' }}
            />
            <div 
              className="h-0.5 rounded"
              style={{ backgroundColor: template.colors.secondary, width: '65%' }}
            />
            <div 
              className="h-0.5 rounded"
              style={{ backgroundColor: template.colors.secondary, width: '45%' }}
            />
          </div>

          {/* Cards mockup */}
          <div className="grid grid-cols-2 gap-1 mt-3">
            {[1, 2].map((i) => (
              <div 
                key={i}
                className="h-6 rounded border p-1"
                style={{ 
                  backgroundColor: template.colors.surface,
                  borderColor: template.colors.primary + '40'
                }}
              >
                <div 
                  className="h-1 rounded mb-1"
                  style={{ backgroundColor: template.colors.primary, width: '80%' }}
                />
                <div 
                  className="h-0.5 rounded"
                  style={{ backgroundColor: template.colors.accent, width: '60%' }}
                />
              </div>
            ))}
          </div>

          {/* Accent elements */}
          <div className="absolute bottom-2 right-2">
            <div 
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: template.colors.accent }}
            />
          </div>
        </div>

        {/* Overlay de selección */}
        {isSelected && (
          <div className="absolute top-2 right-2 bg-blue-600 text-white p-1 rounded-full">
            <Icons.Check size={12} />
          </div>
        )}

        {/* Overlay de hover con acciones */}
        {isHovered && !isSelected && (
          <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onSelect();
              }}
              className="bg-white text-gray-900 px-3 py-1 rounded-md text-sm font-medium hover:bg-gray-100"
            >
              Seleccionar
            </button>
          </div>
        )}
      </div>

      {/* Información de la plantilla */}
      <div className="p-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="font-medium text-gray-900 text-sm">{template.name}</h3>
            <p className="text-xs text-gray-600 mt-1 line-clamp-2">{template.description}</p>
            
            {/* Tags */}
            <div className="flex flex-wrap gap-1 mt-2">
              {template.category && (
                <span className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full text-xs">
                  {template.category}
                </span>
              )}
              {template.tags?.slice(0, 2).map((tag) => (
                <span 
                  key={tag}
                  className="px-2 py-0.5 bg-blue-100 text-blue-600 rounded-full text-xs"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Botón de personalización */}
          {isSelected && onCustomize && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onCustomize();
              }}
              className="text-blue-600 hover:text-blue-700 p-1"
              title="Personalizar plantilla"
            >
              <Icons.Settings size={14} />
            </button>
          )}
        </div>
      </div>

      {/* Indicador de plantilla activa */}
      {isSelected && (
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-blue-600"></div>
      )}
    </div>
  );
};

export const TemplateSelector: React.FC<TemplateSelectorProps> = ({
  templates,
  selectedTemplate,
  onSelectTemplate,
  onCustomize,
  onAddTemplate
}) => {
  const [filter, setFilter] = useState<string>('all');

  // Filtrar plantillas por categoría
  const filteredTemplates = templates.filter(template => 
    filter === 'all' || template.category === filter
  );

  // Obtener categorías únicas
  const categories = ['all', ...Array.from(new Set(templates.map(t => t.category).filter(Boolean)))];

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Plantillas de Portfolio</h2>
          <p className="text-sm text-gray-600">
            Elige una plantilla base y personalízala según tus necesidades
          </p>
        </div>

        {onAddTemplate && (
          <button
            onClick={onAddTemplate}
            className="flex items-center gap-2 bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700"
          >
            <Icons.Plus size={16} />
            Nueva Plantilla
          </button>
        )}
      </div>

      {/* Filtros */}
      <div className="flex gap-2 flex-wrap">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setFilter(category)}
            className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
              filter === category
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {category === 'all' ? 'Todas' : category}
          </button>
        ))}
      </div>

      {/* Grid de plantillas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredTemplates.map((template) => (
          <TemplateCard
            key={template.id}
            template={template}
            isSelected={selectedTemplate?.id === template.id}
            onSelect={() => onSelectTemplate(template)}
            onCustomize={onCustomize}
          />
        ))}
      </div>

      {/* Plantilla seleccionada info */}
      {selectedTemplate && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-blue-600 rounded-lg">
              <Icons.Settings size={16} className="text-white" />
            </div>
            <div className="flex-1">
              <h3 className="font-medium text-blue-900">
                Plantilla seleccionada: {selectedTemplate.name}
              </h3>
              <p className="text-sm text-blue-700 mt-1">
                {selectedTemplate.description}
              </p>
              <div className="flex items-center gap-3 mt-2">
                <span className="text-xs text-blue-600">
                  Versión: {selectedTemplate.version}
                </span>
                {selectedTemplate.author && (
                  <span className="text-xs text-blue-600">
                    Por: {selectedTemplate.author}
                  </span>
                )}
              </div>
            </div>
            {onCustomize && (
              <button
                onClick={onCustomize}
                className="flex items-center gap-1 bg-blue-600 text-white px-3 py-1.5 rounded-md text-sm hover:bg-blue-700"
              >
                <Icons.Settings size={14} />
                Personalizar
              </button>
            )}
          </div>
        </div>
      )}

      {/* Estado vacío */}
      {filteredTemplates.length === 0 && (
        <div className="text-center py-12">
          <Icons.Settings size={48} className="mx-auto text-gray-300 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No hay plantillas en esta categoría
          </h3>
          <p className="text-gray-600 mb-4">
            Prueba con otra categoría o agrega una nueva plantilla personalizada
          </p>
          {onAddTemplate && (
            <button
              onClick={onAddTemplate}
              className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              <Icons.Plus size={16} />
              Crear Primera Plantilla
            </button>
          )}
        </div>
      )}
    </div>
  );
};