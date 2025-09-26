import React, { useState, useCallback, useMemo } from "react";
import {
  Eye,
  EyeOff,
  Settings,
  Menu,
  Plus,
  X,
  Code,
  Palette,
  Type,
  LayoutGrid,
  Cog,
} from "lucide-react";
import type { Section } from "../types/advanced-template-types";

// Types
type LayoutArea =
  | "header"
  | "sidebar-left"
  | "main"
  | "sidebar-right"
  | "footer"
  | "floating";
type SectionPlacement = "unplaced" | "placed";

type TabSection = "layout" | "colors" | "typography" | "sections" | "advanced";

interface SectionWithPlacement extends Section {
  placement: SectionPlacement;
}

interface AreaConfig {
  enabled: boolean;
}

interface DragConfig {
  draggedItem: SectionWithPlacement | null;
  dragOverArea: LayoutArea | null;
  dragOverIndex: number | null;
}

const DEFAULT_AREAS: Record<LayoutArea, AreaConfig> = {
  header: { enabled: true },
  "sidebar-left": { enabled: false },
  "sidebar-right": { enabled: false },
  main: { enabled: true },
  footer: { enabled: true },
  floating: { enabled: false },
};

// Helper functions
function addPlacement(sections: Section[]): SectionWithPlacement[] {
  return sections.map((s) => {
    const fullSection: Section = {
      id: s.id,
      name: s.name,
      type: s.type || "hero",
      icon: s.icon || "📄",
      area: s.area || "main",
      order: s.order || 0,
      enabled: s.enabled !== undefined ? s.enabled : true,
      config: s.config || { variant: "default", columns: 1 },
    };

    const placement: SectionPlacement =
      fullSection.enabled && fullSection.area !== "floating"
        ? "placed"
        : "unplaced";

    return {
      ...fullSection,
      placement,
    };
  });
}

function removePlacement(sections: SectionWithPlacement[]): Section[] {
  return sections.map(({ placement, ...rest }) => rest as Section);
}

function moveSection(
  sections: SectionWithPlacement[],
  draggedId: string,
  targetArea: LayoutArea,
  insertIndex: number | null
): SectionWithPlacement[] {
  const dragged = sections.find((s) => s.id === draggedId);
  if (!dragged) return sections;

  const withoutDragged = sections.filter((s) => s.id !== draggedId);
  const targetList = withoutDragged
    .filter((s) => s.area === targetArea)
    .sort((a, b) => a.order - b.order);

  const index =
    insertIndex == null
      ? targetList.length
      : Math.max(0, Math.min(insertIndex, targetList.length));

  const draggedUpdated: SectionWithPlacement = {
    ...dragged,
    area: targetArea,
    enabled: true,
    placement: "placed",
    order: index + 1, // ASIGNAR EL ORDER CORRECTO AQUÍ
  };

  const others = withoutDragged.filter((s) => s.area !== targetArea);
  const newTarget = [...targetList];
  newTarget.splice(index, 0, draggedUpdated);

  // Reasignar orders a todos los elementos del área target
  const reorderedTarget = newTarget.map((s, i) => ({ ...s, order: i + 1 }));

  return [...others, ...reorderedTarget];
}

// UI Components
interface TabButtonProps {
  active: boolean;
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
}

const TabButton: React.FC<TabButtonProps> = ({
  active,
  icon,
  label,
  onClick,
}) => (
  <button
    onClick={onClick}
    className={`
      flex items-center gap-2 px-4 py-2.5 rounded-lg transition-all text-sm font-medium
      ${
        active
          ? "bg-blue-100 text-blue-700 border border-blue-200"
          : "bg-gray-50 text-gray-600 hover:bg-gray-100 border border-transparent"
      }
    `}
  >
    {icon}
    <span>{label}</span>
  </button>
);

interface AvailableSectionCardProps {
  section: SectionWithPlacement;
  isDragging: boolean;
  onDragStart: (
    e: React.DragEvent<HTMLDivElement>,
    section: SectionWithPlacement
  ) => void;
  onDragEnd: () => void;
}

const AvailableSectionCard: React.FC<AvailableSectionCardProps> = ({
  section,
  isDragging,
  onDragStart,
  onDragEnd,
}) => (
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

interface AreaSectionRowProps {
  section: SectionWithPlacement;
  isDragOverBefore: boolean;
  isDragOverAfter: boolean;
  onDragStart: (
    e: React.DragEvent<HTMLDivElement>,
    section: SectionWithPlacement
  ) => void;
  onDragEnd: () => void;
  onDragOverRow: (
    e: React.DragEvent<HTMLDivElement>,
    section: SectionWithPlacement
  ) => void;
  onDragLeaveRow: () => void;
  onRemove: (id: string) => void;
  onToggle: (id: string, enabled: boolean) => void;
}

const AreaSectionRow: React.FC<AreaSectionRowProps> = ({
  section,
  isDragOverBefore,
  isDragOverAfter,
  onDragStart,
  onDragEnd,
  onDragOverRow,
  onDragLeaveRow,
  onRemove,
  onToggle,
}) => (
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
    {isDragOverBefore && (
      <div className="absolute -top-1 left-0 right-0 h-0.5 bg-blue-500 rounded-full" />
    )}
    {isDragOverAfter && (
      <div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-blue-500 rounded-full" />
    )}

    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <Menu
          size={14}
          className="text-gray-400 cursor-grab active:cursor-grabbing"
        />
        <span>{section.icon}</span>
        <span className="font-medium">{section.name}</span>
      </div>
      <div className="flex items-center gap-1">
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
        <button
          onClick={() => onRemove(section.id)}
          className="p-1 text-orange-600 hover:bg-orange-100 rounded"
          title="Mover a disponibles"
        >
          <X size={12} />
        </button>
        <span className="text-xs text-gray-500">#{section.order}</span>
      </div>
    </div>
  </div>
);

interface DropAreaProps {
  area: LayoutArea;
  sections: SectionWithPlacement[];
  isActive: boolean;
  onDrop: (e: React.DragEvent<HTMLDivElement>, area: LayoutArea) => void;
  onDragOver: (e: React.DragEvent<HTMLDivElement>, area: LayoutArea) => void;
  onDragLeave: () => void;
  onDragOverRow: (
    e: React.DragEvent<HTMLDivElement>,
    section: SectionWithPlacement
  ) => void;
  onDragLeaveRow: () => void;
  onRowDragStart: (
    e: React.DragEvent<HTMLDivElement>,
    section: SectionWithPlacement
  ) => void;
  onRowDragEnd: () => void;
  areaConfig: AreaConfig;
  onAreaToggle: (area: LayoutArea, enabled: boolean) => void;
  dragOverIndex: number | null;
  draggedId: string | null;
  onRemove: (id: string) => void;
  onToggle: (id: string, enabled: boolean) => void;
}

const DropArea: React.FC<DropAreaProps> = ({
  area,
  sections,
  isActive,
  onDrop,
  onDragOver,
  onDragLeave,
  onDragOverRow,
  onDragLeaveRow,
  onRowDragStart,
  onRowDragEnd,
  areaConfig,
  onAreaToggle,
  dragOverIndex,
  draggedId,
  onRemove,
  onToggle,
}) => {
  const areaNames: Record<LayoutArea, string> = {
    header: "Header",
    "sidebar-left": "Sidebar Izquierda",
    "sidebar-right": "Sidebar Derecha",
    main: "Contenido Principal",
    footer: "Footer",
    floating: "Elementos Flotantes",
  };

  const areaIcons: Record<LayoutArea, string> = {
    header: "📄",
    "sidebar-left": "⬅️",
    "sidebar-right": "➡️",
    main: "📃",
    footer: "🔻",
    floating: "💫",
  };

  return (
    <div
      onDrop={(e) => onDrop(e, area)}
      onDragOver={(e) => onDragOver(e, area)}
      onDragLeave={onDragLeave}
      className={`
        min-h-[110px] border-2 border-dashed rounded-lg p-4 transition-all
        ${isActive ? "border-blue-500 bg-blue-50" : "border-gray-300"}
        ${!areaConfig?.enabled ? "opacity-50" : ""}
      `}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-xl">{areaIcons[area]}</span>
          <h3 className="font-medium text-gray-800">{areaNames[area]}</h3>
          <span className="text-xs text-gray-500">({sections.length})</span>
        </div>

        <div className="flex items-center gap-2">
          <label className="flex items-center gap-1 text-xs">
            <input
              type="checkbox"
              checked={areaConfig?.enabled || false}
              onChange={(e) => onAreaToggle(area, e.target.checked)}
              className="rounded"
            />
            Activa
          </label>
        </div>
      </div>

      <div className="space-y-2">
        {sections.length === 0 ? (
          <div className="text-center text-gray-400 py-4">
            <Plus size={24} className="mx-auto mb-2 opacity-50" />
            <p className="text-sm">Arrastra secciones aquí</p>
          </div>
        ) : (
          sections
            .sort((a, b) => a.order - b.order)
            .map((section, i) => {
              const isDragged = draggedId === section.id;
              const isBefore = dragOverIndex === i && !isDragged;
              const isAfter = dragOverIndex === i + 1 && !isDragged;

              return (
                <AreaSectionRow
                  key={section.id}
                  section={section}
                  isDragOverBefore={!!isBefore}
                  isDragOverAfter={!!isAfter}
                  onDragStart={onRowDragStart}
                  onDragEnd={onRowDragEnd}
                  onDragOverRow={onDragOverRow}
                  onDragLeaveRow={onDragLeaveRow}
                  onRemove={onRemove}
                  onToggle={onToggle}
                />
              );
            })
        )}
      </div>
    </div>
  );
};

interface AdvancedLayoutBuilderProps {
  template: any;
  sections: Section[];
  onSectionsChange: (sections: Section[]) => void;
  onLayoutChange: (structure: any) => void;
  layoutStructure?: any;
  onPreview?: () => void;
  onSave?: () => void;
  onReset?: () => void;
  // NUEVAS PROPS
  config?: any;
  onConfigUpdate?: (updates: any) => void;
}
// ===== ColorPicker Component =====
const ColorPicker: React.FC<{
  label: string;
  value: string;
  onChange: (color: string) => void;
  presets?: string[];
}> = ({ label, value, onChange, presets }) => {
  const [showPresets, setShowPresets] = useState(false);
  return (
    <div className="space-y-2">
      <label className="block text-xs font-medium text-gray-700">{label}</label>
      <div className="flex items-center gap-2">
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-8 h-8 rounded border border-gray-300 cursor-pointer"
        />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="flex-1 px-2 py-1 text-xs border rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
          placeholder="#000000"
        />
        {presets && (
          <button
            onClick={() => setShowPresets(!showPresets)}
            className="p-1 text-gray-400 hover:text-gray-600"
          >
            ▼
          </button>
        )}
      </div>
      {showPresets && presets && (
        <div className="grid grid-cols-6 gap-1 p-2 border rounded bg-gray-50">
          {presets.map((preset) => (
            <button
              key={preset}
              onClick={() => onChange(preset)}
              className="w-6 h-6 rounded border border-gray-300 hover:scale-110 transition-transform"
              style={{ backgroundColor: preset }}
              title={preset}
            />
          ))}
        </div>
      )}
    </div>
  );
};
// Main Component
export function AdvancedLayoutBuilder({
  template,
  sections: propSections,
  onSectionsChange,
  onLayoutChange,
  layoutStructure,
  onPreview,
  onSave,
  onReset,
  config,
  onConfigUpdate,
}: AdvancedLayoutBuilderProps) {
  const [activeTab, setActiveTab] = useState<TabSection>("layout");
  const [areas, setAreas] = useState<Record<LayoutArea, AreaConfig>>(() => {
    const structure = layoutStructure ?? template?.layoutStructure;
    return structure?.areas || DEFAULT_AREAS;
  });
  const updateColors = useCallback(
    (colorUpdates: any) => {
      if (!onConfigUpdate || !config) return;
      onConfigUpdate({
        colors: {
          ...(config.customizations?.colors ?? {}),
          ...colorUpdates,
        },
      });
    },
    [config, onConfigUpdate]
  );

  const updateTypography = useCallback(
    (typography: any) => {
      if (!onConfigUpdate) return;
      onConfigUpdate({ typography });
    },
    [onConfigUpdate]
  );
  // Usar las secciones que vienen por props
  const [sections, setSections] = useState<SectionWithPlacement[]>(() => {
    if (propSections && propSections.length > 0) {
      return addPlacement(propSections);
    }
    // Fallback a secciones de ejemplo si no hay props
    return [
      {
        id: "1",
        name: "Sobre mí",
        type: "about",
        icon: "👤",
        area: "main",
        order: 1,
        enabled: true,
        config: {},
        placement: "placed",
      },
      {
        id: "2",
        name: "Proyectos",
        type: "projects",
        icon: "💼",
        area: "main",
        order: 2,
        enabled: true,
        config: {},
        placement: "placed",
      },
      {
        id: "3",
        name: "Habilidades",
        type: "skills",
        icon: "⚡",
        area: "main",
        order: 3,
        enabled: true,
        config: {},
        placement: "placed",
      },
      {
        id: "4",
        name: "Contacto",
        type: "contact",
        icon: "📧",
        area: "floating",
        order: 0,
        enabled: false,
        config: {},
        placement: "unplaced",
      },
      {
        id: "5",
        name: "Testimonios",
        type: "testimonials",
        icon: "💬",
        area: "floating",
        order: 0,
        enabled: false,
        config: {},
        placement: "unplaced",
      },
    ];
  });

  const [dragConfig, setDragConfig] = useState<DragConfig>({
    draggedItem: null,
    dragOverArea: null,
    dragOverIndex: null,
  });

  const unplacedSections = useMemo(
    () => sections.filter((s) => s.placement === "unplaced"),
    [sections]
  );
  const placedSections = useMemo(
    () => sections.filter((s) => s.placement === "placed"),
    [sections]
  );

  const sectionsByArea = useMemo(() => {
    return placedSections.reduce((acc, section) => {
      if (!acc[section.area]) acc[section.area] = [];
      acc[section.area].push(section);
      return acc;
    }, {} as Record<LayoutArea, SectionWithPlacement[]>);
  }, [placedSections]);

  const beginDrag = useCallback(
    (e: React.DragEvent<HTMLDivElement>, section: SectionWithPlacement) => {
      try {
        e.dataTransfer.effectAllowed = "move";
        e.dataTransfer.setData("text/plain", section.id);
      } catch {}
      setDragConfig((prev) => ({ ...prev, draggedItem: section }));
    },
    []
  );

  const endDrag = useCallback(() => {
    setDragConfig({
      draggedItem: null,
      dragOverArea: null,
      dragOverIndex: null,
    });
  }, []);

  const handleDragOverArea = useCallback(
    (e: React.DragEvent<HTMLDivElement>, area: LayoutArea) => {
      e.preventDefault();
      try {
        e.dataTransfer.dropEffect = "move";
      } catch {}
      setDragConfig((prev) => ({
        ...prev,
        dragOverArea: area,
        dragOverIndex: null,
      }));
    },
    []
  );

  const handleDragOverRow = useCallback(
    (e: React.DragEvent<HTMLDivElement>, rowSection: SectionWithPlacement) => {
      e.preventDefault();
      e.stopPropagation(); // AÑADE ESTO

      const area = rowSection.area;
      const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
      const y = e.clientY - rect.top;
      const before = y < rect.height / 2;

      const areaList = (sectionsByArea[area] || []).sort(
        (a, b) => a.order - b.order
      );
      const rowIndex = areaList.findIndex((s) => s.id === rowSection.id);
      const insertIndex = before ? rowIndex : rowIndex + 1;

      setDragConfig((prev) => ({
        ...prev,
        dragOverArea: area,
        dragOverIndex: insertIndex,
      }));
    },
    [sectionsByArea]
  );

  const handleDragLeaveRow = useCallback(() => {
    setDragConfig((prev) => ({ ...prev, dragOverIndex: null }));
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>, targetArea: LayoutArea) => {
      e.preventDefault();
      e.stopPropagation();

      let draggedId: string | null = null;
      try {
        draggedId = e.dataTransfer.getData("text/plain") || null;
      } catch {}

      const finalDraggedId = draggedId || dragConfig.draggedItem?.id;
      if (!finalDraggedId) return;

      // CORRECCIÓN: Ajustar el índice si estamos moviendo dentro de la misma área
      let adjustedIndex = dragConfig.dragOverIndex;

      if (dragConfig.dragOverArea === targetArea && adjustedIndex !== null) {
        const areaSections = sections
          .filter((s) => s.area === targetArea)
          .sort((a, b) => a.order - b.order);

        const currentIndex = areaSections.findIndex(
          (s) => s.id === finalDraggedId
        );

        // Si movemos hacia abajo en la misma área, restar 1 al índice
        if (currentIndex !== -1 && currentIndex < adjustedIndex) {
          adjustedIndex = adjustedIndex - 1;
        }
      }

      const next = moveSection(
        sections,
        finalDraggedId,
        targetArea,
        adjustedIndex
      );
      setSections(next);
      onSectionsChange(removePlacement(next));
      setDragConfig({
        draggedItem: null,
        dragOverArea: null,
        dragOverIndex: null,
      });
    },
    [dragConfig, sections, onSectionsChange]
  );

  const handleAreaToggle = useCallback(
    (area: LayoutArea, enabled: boolean) => {
      const newAreas = {
        ...areas,
        [area]: { ...areas[area], enabled },
      };
      setAreas(newAreas);

      const structure = layoutStructure ?? template?.layoutStructure;
      onLayoutChange({
        ...structure,
        areas: newAreas,
      });
    },
    [areas, layoutStructure, template, onLayoutChange]
  );

  const handleSectionToggle = useCallback(
    (sectionId: string, enabled: boolean) => {
      const updated = sections.map((s) =>
        s.id === sectionId ? { ...s, enabled } : s
      );
      setSections(updated);
      onSectionsChange(removePlacement(updated));
    },
    [sections, onSectionsChange]
  );

  const handleRemoveSection = useCallback(
    (sectionId: string) => {
      const updated = sections.map((s) =>
        s.id === sectionId
          ? {
              ...s,
              placement: "unplaced" as SectionPlacement,
              enabled: false,
              area: "floating" as LayoutArea,
              order: 0,
            }
          : s
      );
      setSections(updated);
      onSectionsChange(removePlacement(updated));
    },
    [sections, onSectionsChange]
  );

  const layoutAreas: LayoutArea[] = [
    "header",
    "sidebar-left",
    "main",
    "sidebar-right",
    "footer",
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Tabs */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex gap-2 py-3">
            <TabButton
              active={activeTab === "layout"}
              icon={<Code size={16} />}
              label="Layout"
              onClick={() => setActiveTab("layout")}
            />
            <TabButton
              active={activeTab === "colors"}
              icon={<Palette size={16} />}
              label="Colores"
              onClick={() => setActiveTab("colors")}
            />
            <TabButton
              active={activeTab === "typography"}
              icon={<Type size={16} />}
              label="Tipografía"
              onClick={() => setActiveTab("typography")}
            />
            <TabButton
              active={activeTab === "sections"}
              icon={<LayoutGrid size={16} />}
              label="Secciones"
              onClick={() => setActiveTab("sections")}
            />
            <TabButton
              active={activeTab === "advanced"}
              icon={<Cog size={16} />}
              label="Avanzado"
              onClick={() => setActiveTab("advanced")}
            />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto p-6">
        {activeTab === "layout" && (
          <div className="space-y-6">
            <div className="space-y-6">
              {/* Editor de Portfolio - Ancho completo */}

              <div className="bg-white border rounded-xl p-4 overflow-x-auto">
                <div
                  className="grid gap-2 min-w-[900px]"
                  style={{
                    gridTemplateAreas: `
                        "header header header"
                        "sidebar-left main sidebar-right"
                        "footer footer footer"
                      `,
                    gridTemplateColumns: "1fr 2fr 1fr",
                    gridTemplateRows: "auto 1fr auto",
                  }}
                >
                  {layoutAreas.map((area) => {
                    const areaSections = sectionsByArea[area] || [];
                    const areaConfig = areas[area];

                    return (
                      <div key={area} style={{ gridArea: area }}>
                        <DropArea
                          area={area}
                          sections={areaSections}
                          isActive={dragConfig.dragOverArea === area}
                          onDrop={handleDrop}
                          onDragOver={handleDragOverArea}
                          onDragLeave={() =>
                            setDragConfig((p) => ({
                              ...p,
                              dragOverIndex: null,
                            }))
                          }
                          onDragOverRow={handleDragOverRow}
                          onDragLeaveRow={handleDragLeaveRow}
                          onRowDragStart={beginDrag}
                          onRowDragEnd={endDrag}
                          areaConfig={areaConfig}
                          onAreaToggle={handleAreaToggle}
                          dragOverIndex={dragConfig.dragOverIndex}
                          draggedId={dragConfig.draggedItem?.id ?? null}
                          onRemove={handleRemoveSection}
                          onToggle={handleSectionToggle}
                        />
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Secciones Disponibles - Abajo */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium text-gray-800">
                    Secciones Disponibles
                  </h4>
                  <span className="text-xs bg-gray-200 px-2 py-1 rounded-full">
                    ({unplacedSections.length})
                  </span>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
                  {unplacedSections.map((section) => (
                    <AvailableSectionCard
                      key={section.id}
                      section={section}
                      isDragging={dragConfig.draggedItem?.id === section.id}
                      onDragStart={beginDrag}
                      onDragEnd={endDrag}
                    />
                  ))}

                  <button className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-blue-400 hover:bg-blue-50 transition-colors">
                    <Plus size={20} className="mx-auto mb-1 text-gray-400" />
                    <span className="text-xs text-gray-600">
                      Crear Sección Custom
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "colors" && config && onConfigUpdate && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                Personalizar Colores
              </h3>
              <p className="text-gray-600 text-sm">
                Configura la paleta de colores de tu portfolio
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="space-y-3">
                <h3 className="font-medium text-gray-800">
                  Colores Principales
                </h3>
                <ColorPicker
                  label="Primario"
                  value={
                    config.customizations?.colors?.primary ||
                    template?.colors?.primary ||
                    "#3B82F6"
                  }
                  onChange={(c) => updateColors({ primary: c })}
                  presets={[
                    "#3B82F6",
                    "#6366F1",
                    "#8B5CF6",
                    "#EC4899",
                    "#EF4444",
                    "#F59E0B",
                    "#10B981",
                    "#06B6D4",
                  ]}
                />
                <ColorPicker
                  label="Secundario"
                  value={
                    config.customizations?.colors?.secondary ||
                    template?.colors?.secondary ||
                    "#6366F1"
                  }
                  onChange={(c) => updateColors({ secondary: c })}
                  presets={[
                    "#3B82F6",
                    "#6366F1",
                    "#8B5CF6",
                    "#EC4899",
                    "#EF4444",
                    "#F59E0B",
                    "#10B981",
                    "#06B6D4",
                  ]}
                />
                <ColorPicker
                  label="Acento"
                  value={
                    config.customizations?.colors?.accent ||
                    template?.colors?.accent ||
                    "#EF4444"
                  }
                  onChange={(c) => updateColors({ accent: c })}
                  presets={[
                    "#3B82F6",
                    "#6366F1",
                    "#8B5CF6",
                    "#EC4899",
                    "#EF4444",
                    "#F59E0B",
                    "#10B981",
                    "#06B6D4",
                  ]}
                />
              </div>

              <div className="space-y-3">
                <h3 className="font-medium text-gray-800">Superficies</h3>
                <ColorPicker
                  label="Fondo"
                  value={
                    config.customizations?.colors?.background ||
                    template?.colors?.background ||
                    "#ffffff"
                  }
                  onChange={(c) => updateColors({ background: c })}
                />
                <ColorPicker
                  label="Superficie"
                  value={
                    config.customizations?.colors?.surface ||
                    template?.colors?.surface ||
                    "#f7f7f9"
                  }
                  onChange={(c) => updateColors({ surface: c })}
                />
              </div>

              <div className="space-y-3">
                <h3 className="font-medium text-gray-800">Texto</h3>
                <ColorPicker
                  label="Texto Principal"
                  value={
                    config.customizations?.colors?.text?.primary ||
                    template?.colors?.text?.primary ||
                    "#0f172a"
                  }
                  onChange={(c) =>
                    updateColors({
                      text: {
                        ...(config.customizations?.colors?.text ?? {}),
                        primary: c,
                      },
                    })
                  }
                />
                <ColorPicker
                  label="Texto Secundario"
                  value={
                    config.customizations?.colors?.text?.secondary ||
                    template?.colors?.text?.secondary ||
                    "#64748b"
                  }
                  onChange={(c) =>
                    updateColors({
                      text: {
                        ...(config.customizations?.colors?.text ?? {}),
                        secondary: c,
                      },
                    })
                  }
                />
              </div>
            </div>
          </div>
        )}

        {activeTab === "typography" && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                Personalizar Tipografía
              </h3>
              <p className="text-gray-600 text-sm">
                Configura las fuentes y estilos de texto
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl p-6 border">
                <h4 className="font-medium mb-4">Fuentes</h4>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Fuente Principal
                    </label>
                    <select
                      value={
                        config?.customizations?.typography?.fontFamilies
                          ?.primary ||
                        template?.typography?.fontFamilies?.primary ||
                        "'Inter', sans-serif"
                      }
                      onChange={(e) =>
                        onConfigUpdate?.({
                          typography: {
                            ...(config?.customizations?.typography ?? {}),
                            fontFamilies: {
                              ...(config?.customizations?.typography
                                ?.fontFamilies ?? {}),
                              primary: e.target.value,
                            },
                          },
                        })
                      }
                      className="w-full border rounded-lg px-3 py-2"
                    >
                      <option value="'Inter', sans-serif">Inter</option>
                      <option value="'Roboto', sans-serif">Roboto</option>
                      <option value="'Open Sans', sans-serif">Open Sans</option>
                      <option value="'Poppins', sans-serif">Poppins</option>
                      <option value="'Montserrat', sans-serif">
                        Montserrat
                      </option>
                      <option value="'Lato', sans-serif">Lato</option>
                      <option value="'Playfair Display', serif">
                        Playfair Display
                      </option>
                      <option value="'Merriweather', serif">
                        Merriweather
                      </option>
                      <option value="'Lora', serif">Lora</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Fuente de Títulos
                    </label>
                    <select
                      value={
                        config?.customizations?.typography?.fontFamilies
                          ?.heading ||
                        template?.typography?.fontFamilies?.heading ||
                        "'Inter', sans-serif"
                      }
                      onChange={(e) =>
                        onConfigUpdate?.({
                          typography: {
                            ...(config?.customizations?.typography ?? {}),
                            fontFamilies: {
                              ...(config?.customizations?.typography
                                ?.fontFamilies ?? {}),
                              heading: e.target.value,
                            },
                          },
                        })
                      }
                      className="w-full border rounded-lg px-3 py-2"
                    >
                      <option value="'Inter', sans-serif">Inter</option>
                      <option value="'Roboto', sans-serif">Roboto</option>
                      <option value="'Open Sans', sans-serif">Open Sans</option>
                      <option value="'Poppins', sans-serif">Poppins</option>
                      <option value="'Montserrat', sans-serif">
                        Montserrat
                      </option>
                      <option value="'Lato', sans-serif">Lato</option>
                      <option value="'Playfair Display', serif">
                        Playfair Display
                      </option>
                      <option value="'Merriweather', serif">
                        Merriweather
                      </option>
                      <option value="'Lora', serif">Lora</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Fuente Monoespaciada
                    </label>
                    <select
                      value={
                        config?.customizations?.typography?.fontFamilies
                          ?.code ||
                        template?.typography?.fontFamilies?.code ||
                        "'Fira Code', monospace"
                      }
                      onChange={(e) =>
                        onConfigUpdate?.({
                          typography: {
                            ...(config?.customizations?.typography ?? {}),
                            fontFamilies: {
                              ...(config?.customizations?.typography
                                ?.fontFamilies ?? {}),
                              code: e.target.value,
                            },
                          },
                        })
                      }
                      className="w-full border rounded-lg px-3 py-2"
                    >
                      <option value="'Fira Code', monospace">Fira Code</option>
                      <option value="'JetBrains Mono', monospace">
                        JetBrains Mono
                      </option>
                      <option value="'Source Code Pro', monospace">
                        Source Code Pro
                      </option>
                      <option value="'Roboto Mono', monospace">
                        Roboto Mono
                      </option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 border">
                <h4 className="font-medium mb-4">Tamaños de Texto</h4>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Texto Base
                    </label>
                    <select
                      value={
                        config?.customizations?.typography?.fontSizes?.base ||
                        template?.typography?.fontSizes?.base ||
                        "1rem"
                      }
                      onChange={(e) =>
                        onConfigUpdate?.({
                          typography: {
                            ...(config?.customizations?.typography ?? {}),
                            fontSizes: {
                              ...(config?.customizations?.typography
                                ?.fontSizes ?? {}),
                              base: e.target.value,
                            },
                          },
                        })
                      }
                      className="w-full border rounded-lg px-3 py-2"
                    >
                      <option value="0.875rem">14px (Pequeño)</option>
                      <option value="1rem">16px (Normal)</option>
                      <option value="1.125rem">18px (Grande)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Escala de Títulos
                    </label>
                    <select
                      className="w-full border rounded-lg px-3 py-2"
                      onChange={(e) => {
                        const scale = parseFloat(e.target.value);
                        const base = parseFloat(
                          config?.customizations?.typography?.fontSizes?.base ||
                            "1"
                        );
                        onConfigUpdate?.({
                          typography: {
                            ...(config?.customizations?.typography ?? {}),
                            fontSizes: {
                              ...(config?.customizations?.typography
                                ?.fontSizes ?? {}),
                              sm: `${(base * 0.875).toFixed(3)}rem`,
                              lg: `${(base * scale).toFixed(3)}rem`,
                              xl: `${(base * Math.pow(scale, 2)).toFixed(
                                3
                              )}rem`,
                              "2xl": `${(base * Math.pow(scale, 3)).toFixed(
                                3
                              )}rem`,
                              "3xl": `${(base * Math.pow(scale, 4)).toFixed(
                                3
                              )}rem`,
                            },
                          },
                        });
                      }}
                    >
                      <option value="1.2">Pequeña (1.2)</option>
                      <option value="1.25">Media (1.25)</option>
                      <option value="1.333">Grande (1.333)</option>
                      <option value="1.5">Extra Grande (1.5)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Peso de Fuente
                    </label>
                    <select
                      value={
                        config?.customizations?.typography?.fontWeights
                          ?.normal ||
                        template?.typography?.fontWeights?.normal ||
                        "400"
                      }
                      onChange={(e) =>
                        onConfigUpdate?.({
                          typography: {
                            ...(config?.customizations?.typography ?? {}),
                            fontWeights: {
                              ...(config?.customizations?.typography
                                ?.fontWeights ?? {}),
                              normal: parseInt(e.target.value),
                            },
                          },
                        })
                      }
                      className="w-full border rounded-lg px-3 py-2"
                    >
                      <option value="300">Light (300)</option>
                      <option value="400">Normal (400)</option>
                      <option value="500">Medium (500)</option>
                      <option value="600">Semi-Bold (600)</option>
                      <option value="700">Bold (700)</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Preview de tipografía */}
            <div className="bg-white rounded-xl p-6 border">
              <h4 className="font-medium mb-4">Vista Previa</h4>
              <div className="space-y-4">
                <div
                  style={{
                    fontFamily:
                      config?.customizations?.typography?.fontFamilies
                        ?.heading || "'Inter', sans-serif",
                    fontSize:
                      config?.customizations?.typography?.fontSizes?.["3xl"] ||
                      "1.875rem",
                    fontWeight:
                      config?.customizations?.typography?.fontWeights?.bold ||
                      700,
                  }}
                >
                  Título Grande
                </div>
                <div
                  style={{
                    fontFamily:
                      config?.customizations?.typography?.fontFamilies
                        ?.primary || "'Inter', sans-serif",
                    fontSize:
                      config?.customizations?.typography?.fontSizes?.base ||
                      "1rem",
                    fontWeight:
                      config?.customizations?.typography?.fontWeights?.normal ||
                      400,
                  }}
                >
                  Este es un párrafo de ejemplo usando la fuente principal. Aquí
                  puedes ver cómo se verá el texto en tu portfolio.
                </div>
                <div
                  style={{
                    fontFamily:
                      config?.customizations?.typography?.fontFamilies?.code ||
                      "'Fira Code', monospace",
                    fontSize:
                      config?.customizations?.typography?.fontSizes?.sm ||
                      "0.875rem",
                  }}
                >
                  const code = "Fuente monoespaciada para código";
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "sections" && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                Gestionar Secciones
              </h3>
              <p className="text-gray-600 text-sm">
                Configura el contenido y comportamiento de cada sección
              </p>
            </div>

            <div className="space-y-4">
              {sections
                .filter((s) => s.placement === "placed")
                .sort((a, b) => {
                  // Ordenar por área y luego por order
                  const areaOrder = [
                    "header",
                    "sidebar-left",
                    "main",
                    "sidebar-right",
                    "footer",
                  ];
                  const areaCompare =
                    areaOrder.indexOf(a.area) - areaOrder.indexOf(b.area);
                  return areaCompare !== 0 ? areaCompare : a.order - b.order;
                })
                .map((section) => (
                  <div
                    key={section.id}
                    className="bg-white rounded-xl p-4 border hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{section.icon}</span>
                        <div>
                          <h4 className="font-medium text-gray-800">
                            {section.name}
                          </h4>
                          <p className="text-xs text-gray-500">
                            {section.area} • Orden: #{section.order}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() =>
                            handleSectionToggle(section.id, !section.enabled)
                          }
                          className={`p-2 rounded-lg transition-colors ${
                            section.enabled
                              ? "text-green-600 bg-green-50 hover:bg-green-100"
                              : "text-gray-400 bg-gray-50 hover:bg-gray-100"
                          }`}
                          title={
                            section.enabled
                              ? "Ocultar sección"
                              : "Mostrar sección"
                          }
                        >
                          {section.enabled ? (
                            <Eye size={18} />
                          ) : (
                            <EyeOff size={18} />
                          )}
                        </button>
                        <button
                          className="p-2 hover:bg-gray-100 rounded-lg text-gray-600"
                          title="Configurar sección"
                        >
                          <Settings size={18} />
                        </button>
                      </div>
                    </div>

                    {/* Configuración de la sección */}
                    <div className="grid grid-cols-2 gap-4 mt-3 pt-3 border-t">
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          Variante de diseño
                        </label>
                        <select
                          value={section.config?.variant || "default"}
                          onChange={(e) => {
                            const updated = sections.map((s) =>
                              s.id === section.id
                                ? {
                                    ...s,
                                    config: {
                                      ...s.config,
                                      variant: e.target.value as
                                        | "default"
                                        | "compact"
                                        | "expanded"
                                        | "minimal",
                                    },
                                  }
                                : s
                            );
                            setSections(updated);
                            onSectionsChange(removePlacement(updated));
                          }}
                          className="w-full px-2 py-1.5 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="default">Por Defecto</option>
                          <option value="compact">Compacta</option>
                          <option value="expanded">Expandida</option>
                          <option value="minimal">Minimalista</option>
                          <option value="card">Tarjetas</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          Columnas (si aplica)
                        </label>
                        <select
                          value={section.config?.columns || 1}
                          onChange={(e) => {
                            const updated = sections.map((s) =>
                              s.id === section.id
                                ? {
                                    ...s,
                                    config: {
                                      ...s.config,
                                      columns: parseInt(e.target.value) as
                                        | 1
                                        | 2
                                        | 3
                                        | 4,
                                    },
                                  }
                                : s
                            );
                            setSections(updated);
                            onSectionsChange(removePlacement(updated));
                          }}
                          className="w-full px-2 py-1.5 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="1">1 columna</option>
                          <option value="2">2 columnas</option>
                          <option value="3">3 columnas</option>
                          <option value="4">4 columnas</option>
                        </select>
                      </div>
                    </div>

                    {/* Info adicional */}
                    <div className="mt-3 pt-3 border-t">
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>
                          Tipo:{" "}
                          <span className="font-medium text-gray-700">
                            {section.type}
                          </span>
                        </span>
                        <span
                          className={`px-2 py-1 rounded-full ${
                            section.enabled
                              ? "bg-green-100 text-green-700"
                              : "bg-gray-100 text-gray-600"
                          }`}
                        >
                          {section.enabled ? "Visible" : "Oculta"}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
            </div>

            {/* Secciones no colocadas */}
            {sections.filter((s) => s.placement === "unplaced").length > 0 && (
              <div className="border-t pt-6">
                <h4 className="font-medium text-gray-700 mb-3">
                  Secciones sin colocar (
                  {sections.filter((s) => s.placement === "unplaced").length})
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {sections
                    .filter((s) => s.placement === "unplaced")
                    .map((section) => (
                      <div
                        key={section.id}
                        className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-3 text-center"
                      >
                        <span className="text-2xl block mb-1">
                          {section.icon}
                        </span>
                        <span className="text-xs text-gray-600 block">
                          {section.name}
                        </span>
                      </div>
                    ))}
                </div>
                <p className="text-xs text-gray-500 mt-3">
                  Arrastra estas secciones al área de layout para agregarlas
                </p>
              </div>
            )}
          </div>
        )}

        {activeTab === "advanced" && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                Configuración Avanzada
              </h3>
              <p className="text-gray-600 text-sm">
                Opciones avanzadas de personalización
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl p-6 border">
                <h4 className="font-medium mb-4">Animaciones</h4>
                <div className="space-y-4">
                  <label className="flex items-center justify-between">
                    <span className="text-sm">Animaciones de entrada</span>
                    <input type="checkbox" className="rounded" defaultChecked />
                  </label>
                  <label className="flex items-center justify-between">
                    <span className="text-sm">Parallax scroll</span>
                    <input type="checkbox" className="rounded" />
                  </label>
                  <label className="flex items-center justify-between">
                    <span className="text-sm">Transiciones suaves</span>
                    <input type="checkbox" className="rounded" defaultChecked />
                  </label>
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Velocidad de animación
                    </label>
                    <select className="w-full border rounded-lg px-3 py-2">
                      <option>Lenta</option>
                      <option>Normal</option>
                      <option>Rápida</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 border">
                <h4 className="font-medium mb-4">SEO y Metadatos</h4>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Título de la página
                    </label>
                    <input
                      type="text"
                      className="w-full border rounded-lg px-3 py-2"
                      placeholder="Mi Portfolio"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Descripción
                    </label>
                    <textarea
                      className="w-full border rounded-lg px-3 py-2"
                      rows={3}
                      placeholder="Descripción del portfolio..."
                    ></textarea>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Favicon URL
                    </label>
                    <input
                      type="text"
                      className="w-full border rounded-lg px-3 py-2"
                      placeholder="https://..."
                    />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 border">
                <h4 className="font-medium mb-4">Espaciado</h4>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Espaciado entre secciones
                    </label>
                    <select className="w-full border rounded-lg px-3 py-2">
                      <option>Compacto</option>
                      <option>Normal</option>
                      <option>Amplio</option>
                      <option>Extra Amplio</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Ancho máximo del contenido
                    </label>
                    <select className="w-full border rounded-lg px-3 py-2">
                      <option>1024px</option>
                      <option>1280px (Recomendado)</option>
                      <option>1536px</option>
                      <option>Ancho completo</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 border">
                <h4 className="font-medium mb-4">CSS Personalizado</h4>
                <div className="space-y-2">
                  <label className="flex items-center gap-2">
                    <input type="checkbox" className="rounded" />
                    <span className="text-sm">Habilitar CSS personalizado</span>
                  </label>
                  <textarea
                    className="w-full border rounded-lg px-3 py-2 font-mono text-sm"
                    rows={6}
                    placeholder="/* Escribe tu CSS aquí */&#10;.custom-class {&#10;  color: #333;&#10;}"
                  ></textarea>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
