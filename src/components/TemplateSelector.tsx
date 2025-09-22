// src/components/TemplateSelector.tsx - CORREGIDO
import React, { useState } from 'react';
import { Template, TemplateSelectorProps } from '../types/template-types';
import { Icons } from './portfolio-icons';

// Componente para tarjeta individual de plantilla
const TemplateCard: React.FC<{
  template: Template;
  isSelected: boolean;
  onSelect: () => void;
  onCustomize?: () => void;
}> = ({ template, isSelected, onSelect, onCustomize }) => {
  return (
    <div 
      className={`relative bg-white rounded-lg border-2 transition-all cursor-pointer hover:shadow-lg ${
        isSelected 
          ? 'border-blue-500 shadow-lg' 
          : 'border-gray-200 hover:border-gray-300'
      }`}
      onClick={onSelect}
    >
      {/* Preview de la plantilla */}
      <div className="aspect-video bg-gradient-to-br from-gray-100 to-gray-200 rounded-t-lg relative overflow-hidden">
        {template.colors.gradient ? (
          <div 
            className="w-full h-full"
            style={{
              background: `linear-gradient(${template.colors.gradient.direction || '135deg'}, ${template.colors.gradient.from}, ${template.colors.gradient.to})`
            }}
          />
        ) : (
          <div 
            className="w-full h-full"
            style={{ backgroundColor: template.colors.primary }}
          />
        )}
        
        {/* Overlay con información */}
        <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center">
          <div className="text-white text-center">
            <div 
              className="text-lg font-bold mb-1"
              style={{ fontFamily: template.typography.fontFamily.heading }}
            >
              {template.name}
            </div>
            <div 
              className="text-sm opacity-90"
              style={{ fontFamily: template.typography.fontFamily.primary }}
            >
              Preview
            </div>
          </div>
        </div>

        {/* Badge de categoría */}
        <div className="absolute top-2 left-2">
          <span className="bg-white bg-opacity-90 text-gray-700 px-2 py-1 rounded text-xs font-medium">
            {template.category}
          </span>
        </div>

        {/* Badge built-in */}
        {template.isBuiltIn && (
          <div className="absolute top-2 right-2">
            <span className="bg-green-500 text-white px-2 py-1 rounded text-xs font-medium">
              Oficial
            </span>
          </div>
        )}
      </div>

      {/* Contenido de la tarjeta */}
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900 mb-1">
              {template.name}
            </h3>
            <p className="text-sm text-gray-600 line-clamp-2">
              {template.description}
            </p>
          </div>
        </div>

        {/* Tags */}
        {template.tags && template.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {template.tags.slice(0, 3).map((tag, index) => (
              <span 
                key={index}
                className="bg-gray-100 text-gray-700 px-2 py-0.5 rounded text-xs"
              >
                {tag}
              </span>
            ))}
            {template.tags.length > 3 && (
              <span className="text-gray-500 text-xs">
                +{template.tags.length - 3} más
              </span>
            )}
          </div>
        )}

        {/* Acciones */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <span>v{template.version}</span>
            {template.author && (
              <>
                <span>•</span>
                <span>{template.author}</span>
              </>
            )}
          </div>
          
          {onCustomize && isSelected && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onCustomize();
              }}
              className="flex items-center gap-1 bg-blue-600 text-white px-3 py-1 rounded text-xs hover:bg-blue-700 transition-colors"
            >
              <Icons.Settings size={12} />
              Personalizar
            </button>
          )}
        </div>
      </div>

      {/* Indicador de selección */}
      {isSelected && (
        <div className="absolute -top-1 -right-1 bg-blue-600 text-white rounded-full p-1">
          <Icons.Check size={12} />
        </div>
      )}
    </div>
  );
};

export const TemplateSelector: React.FC<TemplateSelectorProps> = ({
  templates,
  selectedTemplate,
  onTemplateSelect,
  onCustomize
}) => {
  const [filter, setFilter] = useState<string>('all');

  // Filtrar plantillas por categoría
  const filteredTemplates = templates.filter(template => 
    filter === 'all' || template.category === filter
  );

  // Obtener categorías únicas
  const categories = ['all', ...Array.from(new Set(templates.map(t => t.category).filter(Boolean)))];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Plantillas de Portfolio</h2>
          <p className="text-gray-600 mt-1">
            Elige una plantilla base y personalízala según tus necesidades
          </p>
        </div>
      </div>

      {/* Filtros */}
      <div className="flex gap-2 flex-wrap">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setFilter(category)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === category
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {category === 'all' ? 'Todas' : category.charAt(0).toUpperCase() + category.slice(1)}
          </button>
        ))}
      </div>

      {/* Grid de plantillas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTemplates.map((template) => (
          <TemplateCard
            key={template.id}
            template={template}
            isSelected={selectedTemplate?.id === template.id}
            onSelect={() => onTemplateSelect(template)}
            onCustomize={onCustomize ? () => onCustomize(template) : undefined}
          />
        ))}
      </div>

      {/* Plantilla seleccionada info */}
      {selectedTemplate && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-blue-600 rounded-lg">
              <Icons.Settings size={20} className="text-white" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-blue-900">
                Plantilla seleccionada: {selectedTemplate.name}
              </h3>
              <p className="text-blue-700 mt-1">
                {selectedTemplate.description}
              </p>
              <div className="flex items-center gap-4 mt-3">
                <span className="text-sm text-blue-600">
                  Versión: {selectedTemplate.version}
                </span>
                {selectedTemplate.author && (
                  <span className="text-sm text-blue-600">
                    Autor: {selectedTemplate.author}
                  </span>
                )}
                <span className="text-sm text-blue-600">
                  Categoría: {selectedTemplate.category}
                </span>
              </div>
            </div>
            {onCustomize && (
              <button
                onClick={() => onCustomize(selectedTemplate)}
                className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
              >
                <Icons.Settings size={16} />
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
            Prueba con otra categoría o selecciona "Todas" para ver todas las plantillas disponibles
          </p>
          <button
            onClick={() => setFilter('all')}
            className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Ver todas las plantillas
          </button>
        </div>
      )}
    </div>
  );
};