// AdvancedTemplateSelector.tsx - VERSIÓN CORREGIDA con botón personalizar en tarjetas
import React, { useState, useMemo } from "react";
import { Search, Settings, Grid, List, Check } from "lucide-react";
import {
  AdvancedTemplate,
  AdvancedTemplateSelectorProps,
} from "../types/advanced-template-types";

type ViewMode = "grid" | "list";
type SortBy = "name" | "category" | "recent";

// Card de plantilla - VERSIÓN CORREGIDA
const TemplateCard: React.FC<{
  template: AdvancedTemplate;
  isSelected: boolean;
  onSelect: () => void;
  onCustomize?: (template: AdvancedTemplate) => void;
  onPreview?: () => void;
  viewMode: ViewMode;
}> = ({ template, isSelected, onSelect, onCustomize, onPreview, viewMode }) => {
  const [isHovered, setIsHovered] = useState(false);

  if (viewMode === "list") {
    return (
      <div
        className={`bg-white border rounded-lg p-4 transition-all ${
          isSelected
            ? "border-blue-500 ring-2 ring-blue-100"
            : "border-gray-200 hover:shadow-lg"
        }`}
      >
        <div className="flex items-center gap-4">
          <div
            className="w-24 h-16 rounded-lg flex-shrink-0 cursor-pointer"
            style={{
              background: `linear-gradient(135deg, ${template.colors.background}, ${template.colors.surface})`,
            }}
            onClick={onSelect}
          />
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900">{template.name}</h3>
            <p className="text-sm text-gray-600 mt-1">{template.description}</p>
          </div>

          {/* BOTÓN PERSONALIZAR en vista lista */}
          {isSelected && onCustomize && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                console.log("🔴 CLICK PERSONALIZAR", template.name);
                console.log("🔴 onCustomize existe?", !!onCustomize);
                onCustomize?.(template);
              }}
              className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Settings size={16} />
              Personalizar
            </button>
          )}
        </div>
      </div>
    );
  }

  // Vista GRID
  return (
    <div
      className={`bg-white border-2 rounded-xl overflow-hidden transition-all ${
        isSelected
          ? "border-blue-500 ring-4 ring-blue-100 shadow-xl"
          : "border-gray-200 hover:shadow-lg"
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Preview - clickeable solo si NO está seleccionada */}
      <div
        className={`relative aspect-video bg-gradient-to-br from-gray-50 to-gray-100 ${
          !isSelected ? "cursor-pointer" : ""
        }`}
        onClick={!isSelected ? onSelect : undefined}
      >
        <div
          className="absolute inset-0 p-4"
          style={{
            background: `linear-gradient(135deg, ${template.colors.background}, ${template.colors.surface})`,
          }}
        >
          <div className="relative h-full flex flex-col gap-0.5 bg-gray-100 p-1 rounded">
            {template.layoutStructure?.areas?.header?.enabled !== false && (
              <div
                className="h-6 rounded flex items-center justify-center text-[8px] text-white font-medium"
                style={{
                  background: `linear-gradient(135deg, ${template.colors.primary}, ${template.colors.secondary})`,
                }}
              >
                HEADER
              </div>
            )}

            <div className="flex-1 flex gap-0.5">
              {template.layoutStructure?.areas?.["sidebar-left"]?.enabled && (
                <div
                  className="w-8 rounded flex items-center justify-center text-[7px] font-medium text-gray-600"
                  style={{ backgroundColor: template.colors.surface }}
                >
                  <span className="transform -rotate-90 whitespace-nowrap">
                    SIDE
                  </span>
                </div>
              )}

              <div className="flex-1 rounded p-1 space-y-0.5 bg-white">
                <div
                  className="h-1 rounded"
                  style={{
                    backgroundColor: template.colors.primary,
                    width: "70%",
                  }}
                />
                <div
                  className="h-0.5 rounded"
                  style={{
                    backgroundColor: template.colors.accent,
                    width: "50%",
                    opacity: 0.6,
                  }}
                />
                <div className="grid grid-cols-2 gap-0.5 mt-1">
                  {[1, 2].map((i) => (
                    <div
                      key={i}
                      className="h-4 rounded"
                      style={{ backgroundColor: template.colors.surface }}
                    />
                  ))}
                </div>
                <div className="text-center text-[7px] text-gray-400 mt-1">
                  MAIN
                </div>
              </div>

              {template.layoutStructure?.areas?.["sidebar-right"]?.enabled && (
                <div
                  className="w-8 rounded flex items-center justify-center text-[7px] font-medium text-gray-600"
                  style={{ backgroundColor: template.colors.surfaceVariant }}
                >
                  <span className="transform -rotate-90 whitespace-nowrap">
                    SIDE
                  </span>
                </div>
              )}
            </div>

            {template.layoutStructure?.areas?.footer?.enabled !== false && (
              <div
                className="h-4 rounded flex items-center justify-center text-[8px] text-white font-medium"
                style={{ backgroundColor: template.colors.primary }}
              >
                FOOTER
              </div>
            )}
          </div>
        </div>

        {/* Badge de seleccionada */}
        {isSelected && (
          <div className="absolute top-2 right-2 bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center shadow-lg">
            <Check size={16} />
          </div>
        )}

        {/* Badge Premium */}
        {template.isPremium && (
          <div className="absolute top-2 left-2 bg-yellow-500 text-white rounded-full px-3 py-1 text-xs font-bold shadow-md">
            ⭐ PRO
          </div>
        )}

        {/* Overlay al hover - SOLO si NO está seleccionada */}
        {isHovered && !isSelected && onPreview && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center gap-3">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onPreview();
              }}
              className="bg-white/95 hover:bg-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-lg"
            >
              👁️ Vista Previa
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onSelect();
              }}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-lg"
            >
              Seleccionar
            </button>
          </div>
        )}
      </div>

      {/* Información de la plantilla */}
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 text-base">
          {template.name}
        </h3>
        <p className="text-sm text-gray-600 mt-1 line-clamp-2">
          {template.description}
        </p>

        {/* Tags */}
        <div className="flex items-center justify-between mt-3 mb-3">
          <div className="flex gap-2 flex-wrap">
            <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs font-medium">
              {template.category}
            </span>
            {template.tags?.slice(0, 2).map((tag) => (
              <span
                key={tag}
                className="px-2 py-1 bg-blue-50 text-blue-600 rounded text-xs"
              >
                {tag}
              </span>
            ))}
          </div>
          <span className="text-xs text-gray-500">v{template.version}</span>
        </div>

        {/* BOTÓN PERSONALIZAR - SOLO VISIBLE CUANDO ESTÁ SELECCIONADA */}
        {isSelected && onCustomize && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onCustomize(template);
            }}
            className="w-full bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm flex items-center justify-center gap-2 shadow-sm"
          >
            <Settings size={18} />
            Personalizar esta plantilla
          </button>
        )}

        {/* Mensaje si está seleccionada pero no hay handler */}
        {isSelected && !onCustomize && (
          <div className="w-full bg-gray-100 text-gray-500 px-4 py-3 rounded-lg text-sm text-center">
            Personalización no disponible
          </div>
        )}
      </div>
    </div>
  );
};

// Componente principal
export default function AdvancedTemplateSelector({
  templates,
  selectedTemplate,
  onTemplateSelect,
  onCustomize,
  onPreview,
}: AdvancedTemplateSelectorProps) {
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [showPremiumOnly, setShowPremiumOnly] = useState(false);
  const [sortBy, setSortBy] = useState<SortBy>("name");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const allTags = useMemo(() => {
    const tags = new Set<string>();
    templates.forEach((t) => t.tags?.forEach((tag) => tags.add(tag)));
    return Array.from(tags);
  }, [templates]);

  const filteredTemplates = useMemo(() => {
    let filtered = templates.filter((template) => {
      if (filterCategory !== "all" && template.category !== filterCategory)
        return false;
      if (showPremiumOnly && !template.isPremium) return false;
      if (
        selectedTags.length > 0 &&
        !selectedTags.some((tag) => template.tags?.includes(tag))
      )
        return false;

      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        return (
          template.name.toLowerCase().includes(searchLower) ||
          template.description.toLowerCase().includes(searchLower) ||
          template.tags?.some((tag) => tag.toLowerCase().includes(searchLower))
        );
      }
      return true;
    });

    filtered.sort((a, b) => {
      if (sortBy === "name") return a.name.localeCompare(b.name);
      if (sortBy === "category") return a.category.localeCompare(b.category);
      return 0;
    });

    return filtered;
  }, [
    templates,
    filterCategory,
    searchTerm,
    showPremiumOnly,
    sortBy,
    selectedTags,
  ]);

  const categories = [
    { value: "all", label: "Todas", icon: "🎯" },
    { value: "modern", label: "Modernas", icon: "🚀" },
    { value: "classic", label: "Clásicas", icon: "🎭" },
    { value: "creative", label: "Creativas", icon: "🎨" },
    { value: "minimal", label: "Minimalistas", icon: "⚪" },
    { value: "tech", label: "Tech", icon: "💻" },
    { value: "business", label: "Negocios", icon: "💼" },
  ];

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handlePreview = (template: AdvancedTemplate) => {
    if (onPreview) onPreview(template);
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Plantillas de Portfolio
          </h1>
          <p className="text-gray-600 mt-1">
            {filteredTemplates.length} plantilla
            {filteredTemplates.length !== 1 ? "s" : ""} disponible
            {filteredTemplates.length !== 1 ? "s" : ""}
            {selectedTemplate && (
              <span className="text-blue-600 font-medium ml-2">
                · {selectedTemplate.name} seleccionada
              </span>
            )}
          </p>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <div className="relative">
            <Search
              size={16}
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              placeholder="Buscar plantillas..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-64"
            />
          </div>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortBy)}
            className="px-3 py-2 border rounded-lg text-sm"
          >
            <option value="name">Por nombre</option>
            <option value="category">Por categoría</option>
            <option value="recent">Recientes</option>
          </select>

          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={showPremiumOnly}
              onChange={(e) => setShowPremiumOnly(e.target.checked)}
              className="rounded"
            />
            Solo Premium
          </label>

          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`px-3 py-2 rounded-lg border text-sm flex items-center gap-2 ${
              showFilters
                ? "bg-blue-50 border-blue-300 text-blue-700"
                : "hover:bg-gray-50"
            }`}
          >
            <Settings size={16} />
            Filtros
          </button>

          <div className="flex bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-2 rounded transition-colors ${
                viewMode === "grid" ? "bg-white shadow-sm" : "hover:bg-gray-200"
              }`}
            >
              <Grid size={16} />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-2 rounded transition-colors ${
                viewMode === "list" ? "bg-white shadow-sm" : "hover:bg-gray-200"
              }`}
            >
              <List size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Filtros de tags */}
      {showFilters && allTags.length > 0 && (
        <div className="bg-gray-50 rounded-lg p-4 border">
          <h3 className="text-sm font-medium mb-3">Filtrar por tags:</h3>
          <div className="flex flex-wrap gap-2">
            {allTags.map((tag) => (
              <button
                key={tag}
                onClick={() => toggleTag(tag)}
                className={`px-3 py-1 rounded-full text-sm transition-colors ${
                  selectedTags.includes(tag)
                    ? "bg-blue-600 text-white"
                    : "bg-white border hover:border-blue-300"
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Categorías */}
      <div className="flex flex-wrap gap-2">
        {categories.map((category) => (
          <button
            key={category.value}
            onClick={() => setFilterCategory(category.value)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filterCategory === category.value
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            <span>{category.icon}</span>
            {category.label}
            <span className="bg-white bg-opacity-20 px-2 py-0.5 rounded-full text-xs">
              {category.value === "all"
                ? templates.length
                : templates.filter((t) => t.category === category.value).length}
            </span>
          </button>
        ))}
      </div>

      {/* Grid o lista de plantillas */}
      {filteredTemplates.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-lg font-medium text-gray-800 mb-2">
            No se encontraron plantillas
          </h3>
          <p className="text-gray-600 mb-4">
            Intenta ajustar los filtros o el término de búsqueda
          </p>
          <button
            onClick={() => {
              setSearchTerm("");
              setFilterCategory("all");
              setShowPremiumOnly(false);
              setSelectedTags([]);
            }}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Limpiar filtros
          </button>
        </div>
      ) : (
        <div
          className={
            viewMode === "grid"
              ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
              : "space-y-4"
          }
        >
          {filteredTemplates.map((template) => (
            <TemplateCard
              key={template.id}
              template={template}
              isSelected={selectedTemplate?.id === template.id}
              onSelect={() => onTemplateSelect(template)}
              onCustomize={onCustomize}
              onPreview={() => handlePreview(template)}
              viewMode={viewMode}
            />
          ))}
        </div>
      )}
    </div>
  );
}
