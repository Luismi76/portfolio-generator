// src/components/TemplateSelector.tsx (versión hook-internal, preview robusta)
import React, { useMemo, useState, KeyboardEvent, useState as useReactState } from 'react';
import { useTemplates } from './use-templates';
import { Icons } from './portfolio-icons';

type CardProps = {
  name: string;
  description?: string;
  category: string;
  version: string;
  author?: string;
  isBuiltIn: boolean;
  tags?: string[];
  // Preview inputs
  preview?: string | null;
  gradient?: { from: string; to: string; direction?: string } | null;
  primaryColor: string;
  headingFont: string;
  bodyFont: string;
  selected: boolean;
  onSelect: () => void;
  onCustomize?: () => void;
};

const TemplateCard: React.FC<CardProps> = ({
  name,
  description,
  category,
  version,
  author,
  isBuiltIn,
  tags,
  preview,
  gradient,
  primaryColor,
  headingFont,
  bodyFont,
  selected,
  onSelect,
  onCustomize,
}) => {
  // estado para fallback de imagen
  const [imgOk, setImgOk] = useReactState(true);

  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onSelect();
    }
  };

  const baseStyle: React.CSSProperties = {
    width: '100%',
    height: '100%',
    background: gradient
      ? `linear-gradient(${gradient.direction || '135deg'}, ${gradient.from}, ${gradient.to})`
      : primaryColor,
  };

  return (
    <div
      role="radio"
      aria-checked={selected}
      tabIndex={0}
      onKeyDown={handleKeyDown}
      className={`relative bg-white rounded-lg border-2 transition-all cursor-pointer hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-300 ${
        selected ? 'border-blue-500 shadow-lg' : 'border-gray-200 hover:border-gray-300'
      }`}
      onClick={onSelect}
    >
      {/* Preview: base de color SIEMPRE visible */}
      <div className="aspect-video rounded-t-lg relative overflow-hidden">
        {/* capa base (gradiente o color primario) */}
        <div style={baseStyle} />

        {/* imagen de preview (si existe y carga bien) */}
        {preview && imgOk && (
          <img
            src={preview}
            alt={`Preview de ${name}`}
            className="absolute inset-0 w-full h-full object-cover"
            loading="lazy"
            onError={() => setImgOk(false)}
          />
        )}

        {/* overlay info */}
        <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
          <div className="text-white text-center">
            <div className="text-lg font-bold mb-1" style={{ fontFamily: headingFont }}>
              {name}
            </div>
            <div className="text-sm opacity-90" style={{ fontFamily: bodyFont }}>
              Preview
            </div>
          </div>
        </div>

        {/* badges */}
        <div className="absolute top-2 left-2">
          <span className="bg-white/90 text-gray-700 px-2 py-1 rounded text-xs font-medium">{category}</span>
        </div>
        {isBuiltIn && (
          <div className="absolute top-2 right-2">
            <span className="bg-green-500 text-white px-2 py-1 rounded text-xs font-medium">Oficial</span>
          </div>
        )}
      </div>

      {/* contenido */}
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900 mb-1">{name}</h3>
            {description && <p className="text-sm text-gray-600 line-clamp-2">{description}</p>}
          </div>
        </div>

        {Array.isArray(tags) && tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {tags.slice(0, 3).map((tag, i) => (
              <span key={`${name}-tag-${i}`} className="bg-gray-100 text-gray-700 px-2 py-0.5 rounded text-xs">
                {tag}
              </span>
            ))}
            {tags.length > 3 && <span className="text-gray-500 text-xs">+{tags.length - 3} más</span>}
          </div>
        )}

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <span>v{version}</span>
            {author && (
              <>
                <span>•</span>
                <span>{author}</span>
              </>
            )}
            <span>•</span>
            <span>{category}</span>
          </div>

          {onCustomize && selected && (
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

      {selected && (
        <div className="absolute -top-1 -right-1 bg-blue-600 text-white rounded-full p-1">
          <Icons.Check size={12} />
        </div>
      )}
    </div>
  );
};

export const TemplateSelector: React.FC<{ onCustomizeClick?: () => void }> = ({ onCustomizeClick }) => {
  const { templates, selectedTemplate, selectTemplate } = useTemplates();
  const [filter, setFilter] = useState<string>('all');

  const categories = useMemo(
    () => ['all', ...Array.from(new Set(templates.map((t) => t.category).filter(Boolean)))],
    [templates]
  );

  const filteredTemplates = useMemo(
    () => templates.filter((t) => filter === 'all' || t.category === filter),
    [templates, filter]
  );

  const handleCardKeyDown = (e: KeyboardEvent<HTMLDivElement>, tmplId: string) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      const tmpl = templates.find((t) => t.id === tmplId);
      if (tmpl) selectTemplate(tmpl);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Plantillas de Portfolio</h2>
          <p className="text-gray-600 mt-1">Elige una plantilla base y personalízala</p>
        </div>
        {onCustomizeClick && selectedTemplate && (
          <button
            onClick={onCustomizeClick}
            className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            <Icons.Settings size={16} /> Personalizar
          </button>
        )}
      </div>

      {/* Filtros */}
      <div className="flex gap-2 flex-wrap" role="tablist" aria-label="Filtros de plantillas">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setFilter(category)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === category ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
            role="tab"
            aria-selected={filter === category}
          >
            {category === 'all' ? 'Todas' : category.charAt(0).toUpperCase() + category.slice(1)}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" role="radiogroup" aria-label="Selector de plantillas">
        {filteredTemplates.map((t) => {
          const isSelected = selectedTemplate?.id === t.id;
          return (
            <div
              key={t.id}
              role="radio"
              aria-checked={isSelected}
              tabIndex={0}
              onKeyDown={(e) => handleCardKeyDown(e, t.id)}
              onClick={() => selectTemplate(t)}
            >
              <TemplateCard
                name={t.name}
                description={t.description}
                category={t.category}
                version={t.version}
                author={t.author}
                isBuiltIn={t.isBuiltIn}
                tags={t.tags}
                preview={t.preview}
                gradient={t.colors?.gradient ?? null}
                primaryColor={t.colors?.primary ?? '#999999'}
                headingFont={t.typography.fontFamily.heading}
                bodyFont={t.typography.fontFamily.primary}
                selected={isSelected}
                onSelect={() => selectTemplate(t)}
                onCustomize={onCustomizeClick ? () => onCustomizeClick() : undefined}
              />
            </div>
          );
        })}
      </div>

      {/* Estado vacío */}
      {filteredTemplates.length === 0 && (
        <div className="text-center py-12">
          <Icons.Settings size={48} className="mx-auto text-gray-300 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No hay plantillas en esta categoría</h3>
          <p className="text-gray-600 mb-4">
            Prueba con otra categoría o selecciona &quot;Todas&quot; para ver todas las plantillas disponibles
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
