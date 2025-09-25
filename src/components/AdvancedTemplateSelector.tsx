// components/AdvancedTemplateSelector.tsx
import React, { useState, useMemo } from 'react';
import { AdvancedTemplate } from '../types/advanced-template-types';
import { Icons } from './portfolio-icons';

interface AdvancedTemplateSelectorProps {
  templates: AdvancedTemplate[];
  selectedTemplate?: AdvancedTemplate | null;
  onTemplateSelect: (template: AdvancedTemplate) => void;
  onCustomize?: (template: AdvancedTemplate) => void;
  onPreview?: (template: AdvancedTemplate) => void;
}

type ViewMode = 'grid' | 'list';
type FilterCategory = 'all' | 'modern' | 'classic' | 'creative' | 'minimal' | 'tech' | 'business';

// Card de plantilla con vista previa mejorada
const AdvancedTemplateCard: React.FC<{
  template: AdvancedTemplate;
  isSelected: boolean;
  onSelect: () => void;
  onCustomize?: () => void;
  onPreview?: () => void;
  viewMode: ViewMode;
}> = ({ template, isSelected, onSelect, onCustomize, onPreview, viewMode }) => {
  const [isHovered, setIsHovered] = useState(false);

  if (viewMode === 'list') {
    return (
      <div
        className={`
          bg-white border rounded-lg p-4 cursor-pointer transition-all duration-300 hover:shadow-lg
          ${isSelected ? 'border-blue-500 ring-2 ring-blue-100 shadow-md' : 'border-gray-200'}
        `}
        onClick={onSelect}
      >
        <div className="flex items-center gap-4">
          {/* Preview thumbnail */}
          <div className="w-24 h-16 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg overflow-hidden flex-shrink-0">
            <div 
              className="w-full h-full p-2"
              style={{ 
                background: `linear-gradient(135deg, ${template.colors.background}, ${template.colors.surface})`
              }}
            >
              <div 
                className="w-full h-2 rounded-sm mb-1"
                style={{ backgroundColor: template.colors.primary }}
              />
              <div className="space-y-1">
                <div 
                  className="h-1 rounded"
                  style={{ backgroundColor: template.colors.secondary, width: '70%' }}
                />
                <div 
                  className="h-1 rounded"
                  style={{ backgroundColor: template.colors.accent, width: '50%' }}
                />
              </div>
            </div>
          </div>

          {/* Info */}
          <div className="flex-1">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-semibold text-gray-900">{template.name}</h3>
                <p className="text-sm text-gray-600 mt-1">{template.description}</p>
                
                <div className="flex items-center gap-2 mt-2">
                  <span className={`
                    px-2 py-1 rounded-full text-xs font-medium
                    ${template.category === 'modern' ? 'bg-blue-100 text-blue-700' :
                      template.category === 'creative' ? 'bg-purple-100 text-purple-700' :
                      template.category === 'minimal' ? 'bg-gray-100 text-gray-700' :
                      template.category === 'tech' ? 'bg-green-100 text-green-700' :
                      'bg-orange-100 text-orange-700'}
                  `}>
                    {template.category}
                  </span>
                  
                  {template.isPremium && (
                    <span className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full text-xs font-medium">
                      ⭐ Premium
                    </span>
                  )}
                  
                  <span className="text-xs text-gray-500">
                    v{template.version}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-1">
                {onPreview && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onPreview();
                    }}
                    className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded"
                    title="Vista previa"
                  >
                    <Icons.Eye size={16} />
                  </button>
                )}
                
                {isSelected && onCustomize && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onCustomize();
                    }}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                    title="Personalizar"
                  >
                    <Icons.Settings size={16} />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`
        bg-white border-2 rounded-xl overflow-hidden cursor-pointer transition-all duration-300 group
        ${isSelected 
          ? 'border-blue-500 ring-4 ring-blue-100 shadow-xl scale-105' 
          : 'border-gray-200 hover:border-gray-300 hover:shadow-lg'
        }
      `}
      onClick={onSelect}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Vista previa de la plantilla */}
      <div className="relative aspect-video bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden">
        {/* Mockup más detallado */}
        <div 
          className="w-full h-full p-4 relative"
          style={{ 
            background: `linear-gradient(135deg, ${template.colors.background}, ${template.colors.surface})`
          }}
        >
          {/* Header */}
          <div 
            className="w-full h-8 rounded-lg mb-3 p-2 flex items-center relative overflow-hidden"
            style={{
              background: `linear-gradient(135deg, ${template.colors.primary}, ${template.colors.secondary})`
            }}
          >
            <div className="w-6 h-2 bg-white bg-opacity-80 rounded-full mr-2" />
            <div className="flex-1 space-y-1">
              <div className="h-1 bg-white bg-opacity-60 rounded w-3/4" />
              <div className="h-1 bg-white bg-opacity-40 rounded w-1/2" />
            </div>
            
            {/* Elementos decorativos */}
            <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
              <div className="w-2 h-2 bg-white bg-opacity-60 rounded-full" />
            </div>
          </div>
          
          {/* Contenido */}
          <div className="space-y-2">
            <div 
              className="h-2 rounded-sm"
              style={{ backgroundColor: template.colors.primary, width: '80%' }}
            />
            <div className="flex gap-2">
              <div 
                className="h-1 rounded-sm flex-1"
                style={{ backgroundColor: template.colors.secondary }}
              />
              <div 
                className="h-1 rounded-sm w-12"
                style={{ backgroundColor: template.colors.accent }}
              />
            </div>
            <div className="grid grid-cols-3 gap-1 mt-2">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-6 rounded border"
                  style={{ 
                    backgroundColor: template.colors.surface,
                    borderColor: template.colors.primary + '20'
                  }}
                >
                  <div 
                    className="h-1 rounded-t"
                    style={{ backgroundColor: template.colors.accent, width: `${60 + i * 10}%` }}
                  />
                </div>
              ))}
            </div>
          </div>
          
          {/* Elementos flotantes para mostrar características */}
          {isHovered && (
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center transition-all duration-300">
              <div className="text-white text-center">
                <div className="flex justify-center gap-2 mb-2">
                  {onPreview && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onPreview();
                      }}
                      className="bg-white bg-opacity-20 hover:bg-opacity-30 backdrop-blur-sm rounded-lg px-3 py-2 text-xs font-medium transition-all"
                    >
                      👁️ Ver
                    </button>
                  )}
                  {isSelected && onCustomize && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onCustomize();
                      }}
                      className="bg-white bg-opacity-20 hover:bg-opacity-30 backdrop-blur-sm rounded-lg px-3 py-2 text-xs font-medium transition-all"
                    >
                      ⚙️ Personalizar
                    </button>
                  )}
                </div>
                <div className="text-xs opacity-90">
                  {template.sections?.length || 0} secciones • {template.availableSections?.length || 0} disponibles
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Badge de estado */}
        {isSelected && (
          <div className="absolute top-2 right-2 bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center">
            <Icons.Check size={14} />
          </div>
        )}
        
        {template.isPremium && (
          <div className="absolute top-2 left-2 bg-yellow-500 text-white rounded-full px-2 py-1 text-xs font-bold">
            PRO
          </div>
        )}
      </div>

      {/* Información de la plantilla */}
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
              {template.name}
            </h3>
            <p className="text-sm text-gray-600 line-clamp-2 mt-1">
              {template.description}
            </p>
          </div>
        </div>

        {/* Tags y categoría */}
        <div className="flex items-center justify-between mt-3">
          <div className="flex flex-wrap gap-1">
            <span className={`
              px-2 py-1 rounded-full text-xs font-medium
              ${template.category === 'modern' ? 'bg-blue-100 text-blue-700' :
                template.category === 'creative' ? 'bg-purple-100 text-purple-700' :
                template.category === 'minimal' ? 'bg-gray-100 text-gray-700' :
                template.category === 'tech' ? 'bg-green-100 text-green-700' :
                template.category === 'business' ? 'bg-indigo-100 text-indigo-700' :
                'bg-orange-100 text-orange-700'}
            `}>
              {template.category}
            </span>
            
            {template.tags?.slice(0, 2).map((tag) => (
              <span 
                key={tag}
                className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs"
              >
                {tag}
              </span>
            ))}
          </div>

          <div className="text-xs text-gray-500">
            v{template.version}
          </div>
        </div>

        {/* Características rápidas */}
        <div className="flex items-center justify-between mt-3 text-xs text-gray-500">
          <div className="flex items-center gap-3">
            <span>📱 Responsive</span>
            <span>🎨 {template.sections?.length || 0} secciones</span>
            {template.animations?.enabled && <span>✨ Animado</span>}
            {template.darkMode?.enabled && <span>🌙 Modo oscuro</span>}
          </div>
        </div>
      </div>
    </div>
  );
};

// Componente principal del selector
export const AdvancedTemplateSelector: React.FC<AdvancedTemplateSelectorProps> = ({
  templates,
  selectedTemplate,
  onTemplateSelect,
  onCustomize,
  onPreview,
}) => {
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [filterCategory, setFilterCategory] = useState<FilterCategory>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showPremiumOnly, setShowPremiumOnly] = useState(false);

  // Filtrar plantillas
  const filteredTemplates = useMemo(() => {
    return templates.filter(template => {
      // Filtro por categoría
      if (filterCategory !== 'all' && template.category !== filterCategory) {
        return false;
      }

      // Filtro por premium
      if (showPremiumOnly && !template.isPremium) {
        return false;
      }

      // Filtro por búsqueda
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        return (
          template.name.toLowerCase().includes(searchLower) ||
          template.description.toLowerCase().includes(searchLower) ||
          template.tags?.some(tag => tag.toLowerCase().includes(searchLower))
        );
      }

      return true;
    });
  }, [templates, filterCategory, searchTerm, showPremiumOnly]);

  // Categorías disponibles
  const categories = [
    { value: 'all', label: 'Todas', icon: '🎯' },
    { value: 'modern', label: 'Modernas', icon: '🚀' },
    { value: 'classic', label: 'Clásicas', icon: '🎭' },
    { value: 'creative', label: 'Creativas', icon: '🎨' },
    { value: 'minimal', label: 'Minimalistas', icon: '⚪' },
    { value: 'tech', label: 'Tech', icon: '💻' },
    { value: 'business', label: 'Negocios', icon: '💼' },
  ];

  return (
    <div className="space-y-6">
      {/* Header con controles */}
      <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Plantillas de Portfolio</h1>
          <p className="text-gray-600 mt-1">
            {filteredTemplates.length} plantilla{filteredTemplates.length !== 1 ? 's' : ''} disponible{filteredTemplates.length !== 1 ? 's' : ''}
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Buscador */}
          <div className="relative">
            <Icons.Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar plantillas..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-64"
            />
          </div>

          {/* Filtro premium */}
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={showPremiumOnly}
              onChange={(e) => setShowPremiumOnly(e.target.checked)}
              className="rounded"
            />
            Solo Premium
          </label>

          {/* Modo de vista */}
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded transition-colors ${
                viewMode === 'grid' ? 'bg-white shadow-sm' : 'hover:bg-gray-200'
              }`}
            >
              <Icons.Grid size={16} />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded transition-colors ${
                viewMode === 'list' ? 'bg-white shadow-sm' : 'hover:bg-gray-200'
              }`}
            >
              <Icons.List size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Filtros de categoría */}
      <div className="flex flex-wrap gap-2">
        {categories.map(category => (
          <button
            key={category.value}
            onClick={() => setFilterCategory(category.value as FilterCategory)}
            className={`
              flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors
              ${filterCategory === category.value
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }
            `}
          >
            <span>{category.icon}</span>
            {category.label}
            <span className="bg-white bg-opacity-20 px-2 py-1 rounded-full text-xs">
              {category.value === 'all' 
                ? templates.length 
                : templates.filter(t => t.category === category.value).length
              }
            </span>
          </button>
        ))}
      </div>

      {/* Grid/List de plantillas */}
      {filteredTemplates.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-lg font-medium text-gray-800 mb-2">
            No se encontraron plantillas
          </h3>
          <p className="text-gray-600">
            Intenta ajustar los filtros o el término de búsqueda
          </p>
          <button
            onClick={() => {
              setSearchTerm('');
              setFilterCategory('all');
              setShowPremiumOnly(false);
            }}
            className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Limpiar filtros
          </button>
        </div>
      ) : (
        <div className={
          viewMode === 'grid'
            ? 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6'
            : 'space-y-4'
        }>
          {filteredTemplates.map((template) => (
            <AdvancedTemplateCard
              key={template.id}
              template={template}
              isSelected={selectedTemplate?.id === template.id}
              onSelect={() => onTemplateSelect(template)}
              onCustomize={onCustomize ? () => onCustomize(template) : undefined}
              onPreview={onPreview ? () => onPreview(template) : undefined}
              viewMode={viewMode}
            />
          ))}
        </div>
      )}

      {/* Estadísticas rápidas */}
      {filteredTemplates.length > 0 && (
        <div className="bg-gray-50 rounded-lg p-4 mt-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-blue-600">
                {templates.filter(t => t.category === 'modern').length}
              </div>
              <div className="text-sm text-gray-600">Modernas</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-purple-600">
                {templates.filter(t => t.category === 'creative').length}
              </div>
              <div className="text-sm text-gray-600">Creativas</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-600">
                {templates.filter(t => t.isPremium).length}
              </div>
              <div className="text-sm text-gray-600">Premium</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-600">
                {templates.filter(t => t.animations?.enabled).length}
              </div>
              <div className="text-sm text-gray-600">Con Animaciones</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};