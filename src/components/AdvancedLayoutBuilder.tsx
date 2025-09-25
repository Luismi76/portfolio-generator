import React, { useState, useCallback, useMemo } from 'react';
import { Eye, EyeOff, Settings, Menu, Plus, X } from 'lucide-react';
import type { Section } from '../types/advanced-template-types';

// Types - Extendemos el tipo Section original
type LayoutArea = 'header' | 'sidebar-left' | 'main' | 'sidebar-right' | 'footer' | 'floating';
type SectionPlacement = 'unplaced' | 'placed';

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

const AREA_ORDER: LayoutArea[] = [
  'header',
  'sidebar-left',
  'main',
  'sidebar-right',
  'footer',
  'floating',
];

const DEFAULT_AREAS: Record<LayoutArea, AreaConfig> = {
  header: { enabled: true },
  'sidebar-left': { enabled: false },
  'sidebar-right': { enabled: false },
  main: { enabled: true },
  footer: { enabled: true },
  floating: { enabled: false },
};

// Helper functions
function reassignOrdersByArea(all: SectionWithPlacement[]): SectionWithPlacement[] {
  const next: SectionWithPlacement[] = [];
  for (const area of AREA_ORDER) {
    const areaItems = all
      .filter((s) => s.area === area)
      .sort((a, b) => a.order - b.order)
      .map((s, i) => ({ ...s, order: i + 1 }));
    next.push(...areaItems);
  }
  return next;
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
    placement: 'placed'
  };

  const others = withoutDragged.filter((s) => s.area !== targetArea);
  const newTarget = [...targetList];
  newTarget.splice(index, 0, draggedUpdated);

  return reassignOrdersByArea([...others, ...newTarget]);
}

// UI Components
const AvailableSectionCard: React.FC<{
  section: SectionWithPlacement;
  isDragging: boolean;
  onDragStart: (e: React.DragEvent, section: SectionWithPlacement) => void;
  onDragEnd: () => void;
  onConfigure: (section: SectionWithPlacement) => void;
}> = ({ section, isDragging, onDragStart, onDragEnd, onConfigure }) => (
  <div
    draggable
    onDragStart={(e) => onDragStart(e, section)}
    onDragEnd={onDragEnd}
    className={`
      bg-white rounded-lg border-2 border-dashed p-3 cursor-move transition-all
      ${isDragging ? 'opacity-50 scale-95' : 'opacity-100 scale-100'}
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

      <div className="flex items-center gap-1">
        <button onClick={() => onConfigure(section)} className="p-1 text-gray-600 hover:bg-gray-100 rounded">
          <Settings size={14} />
        </button>
        <Menu size={16} className="text-gray-400" />
      </div>
    </div>
  </div>
);

const AreaSectionRow: React.FC<{
  section: SectionWithPlacement;
  isDragOverBefore: boolean;
  isDragOverAfter: boolean;
  onDragStart: (e: React.DragEvent, section: SectionWithPlacement) => void;
  onDragEnd: () => void;
  onDragOverRow: (e: React.DragEvent, section: SectionWithPlacement) => void;
  onDragLeaveRow: () => void;
  onRemove: (id: string) => void;
  onToggle: (id: string, enabled: boolean) => void;
}> = ({
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
      ${section.enabled ? 'border-green-200 bg-green-50' : 'border-gray-200'}
    `}
  >
    {isDragOverBefore && <div className="absolute -top-1 left-0 right-0 h-0.5 bg-blue-500 rounded-full" />}
    {isDragOverAfter && <div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-blue-500 rounded-full" />}

    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <span>{section.icon}</span>
        <span className="font-medium">{section.name}</span>
      </div>
      <div className="flex items-center gap-1">
        <button
          onClick={() => onToggle(section.id, !section.enabled)}
          className={`p-1 rounded ${
            section.enabled ? 'text-green-600 hover:bg-green-100' : 'text-gray-400 hover:bg-gray-100'
          }`}
          title={section.enabled ? "Ocultar" : "Mostrar"}
        >
          {section.enabled ? <Eye size={12} /> : <EyeOff size={12} />}
        </button>
        <button
          onClick={() => onRemove(section.id)}
          className="p-1 text-red-600 hover:bg-red-100 rounded"
          title="Remover del layout"
        >
          <X size={12} />
        </button>
        <span className="text-xs text-gray-500">#{section.order}</span>
      </div>
    </div>
  </div>
);

const DropArea: React.FC<{
  area: LayoutArea;
  sections: SectionWithPlacement[];
  isActive: boolean;
  onDrop: (e: React.DragEvent, area: LayoutArea) => void;
  onDragOver: (e: React.DragEvent, area: LayoutArea) => void;
  onDragLeave: () => void;
  onDragOverRow: (e: React.DragEvent, section: SectionWithPlacement) => void;
  onDragLeaveRow: () => void;
  onRowDragStart: (e: React.DragEvent, section: SectionWithPlacement) => void;
  onRowDragEnd: () => void;
  areaConfig: AreaConfig;
  onAreaToggle: (area: LayoutArea, enabled: boolean) => void;
  dragOverIndex: number | null;
  draggedId: string | null;
  onRemove: (id: string) => void;
  onToggle: (id: string, enabled: boolean) => void;
}> = ({
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
    header: 'Header',
    'sidebar-left': 'Sidebar Izquierda',
    'sidebar-right': 'Sidebar Derecha',
    main: 'Contenido Principal',
    footer: 'Footer',
    floating: 'Elementos Flotantes',
  };

  const areaIcons: Record<LayoutArea, string> = {
    header: '📄',
    'sidebar-left': '⬅️',
    'sidebar-right': '➡️',
    main: '📃',
    footer: '🔻',
    floating: '💫',
  };

  return (
    <div
      onDrop={(e) => onDrop(e, area)}
      onDragOver={(e) => onDragOver(e, area)}
      onDragLeave={onDragLeave}
      className={`
        min-h-[110px] border-2 border-dashed rounded-lg p-4 transition-all
        ${isActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}
        ${!areaConfig?.enabled ? 'opacity-50' : ''}
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
          <button className="p-1 text-gray-400 hover:text-gray-600">
            <Settings size={14} />
          </button>
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
}

// Helper para añadir placement a las secciones
function addPlacement(sections: Section[]): SectionWithPlacement[] {
  return sections.map(s => ({
    ...s,
    placement: (s.enabled ? 'placed' : 'unplaced') as SectionPlacement
  }));
}

// Helper para remover placement de las secciones
function removePlacement(sections: SectionWithPlacement[]): Section[] {
  return sections.map(({ placement, ...rest }) => rest as Section);
}

// Main Component
export const AdvancedLayoutBuilder: React.FC<AdvancedLayoutBuilderProps> = ({
  template,
  sections: propSections,
  onSectionsChange,
  onLayoutChange,
  layoutStructure,
}) => {
  const [areas, setAreas] = useState<Record<LayoutArea, AreaConfig>>(() => {
    const structure = layoutStructure ?? template.layoutStructure;
    return structure?.areas || DEFAULT_AREAS;
  });
  
  const [sections, setSections] = useState<SectionWithPlacement[]>(() => 
    addPlacement(propSections)
  );

  const [dragConfig, setDragConfig] = useState<DragConfig>({
    draggedItem: null,
    dragOverArea: null,
    dragOverIndex: null,
  });

  const [selectedSection, setSelectedSection] = useState<SectionWithPlacement | null>(null);

  const unplacedSections = useMemo(
    () => sections.filter(s => s.placement === 'unplaced'),
    [sections]
  );

  const placedSections = useMemo(
    () => sections.filter(s => s.placement === 'placed'),
    [sections]
  );

  const sectionsByArea = useMemo(() => {
    return placedSections.reduce((acc, section) => {
      if (!acc[section.area]) acc[section.area] = [];
      acc[section.area].push(section);
      return acc;
    }, {} as Record<LayoutArea, SectionWithPlacement[]>);
  }, [placedSections]);

  const beginDrag = useCallback((e: React.DragEvent, section: SectionWithPlacement) => {
    try {
      e.dataTransfer.setData('text/plain', section.id);
      e.dataTransfer.effectAllowed = 'move';
    } catch {}
    setDragConfig((prev) => ({ ...prev, draggedItem: section }));
  }, []);

  const endDrag = useCallback(() => {
    setDragConfig({ draggedItem: null, dragOverArea: null, dragOverIndex: null });
  }, []);

  const handleDragOverArea = useCallback((e: React.DragEvent, area: LayoutArea) => {
    e.preventDefault();
    try {
      e.dataTransfer.dropEffect = 'move';
    } catch {}
    setDragConfig((prev) => ({ ...prev, dragOverArea: area, dragOverIndex: null }));
  }, []);

  const handleDragOverRow = useCallback(
    (e: React.DragEvent, rowSection: SectionWithPlacement) => {
      e.preventDefault();
      const area = rowSection.area;
      const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
      const y = e.clientY - rect.top;
      const before = y < rect.height / 2;

      const areaList = (sectionsByArea[area] || []).sort((a, b) => a.order - b.order);
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
    (e: React.DragEvent, targetArea: LayoutArea) => {
      e.preventDefault();

      const idInEvent = (() => {
        try {
          return e.dataTransfer.getData('text/plain') || null;
        } catch {
          return null;
        }
      })();

      const draggedId = dragConfig.draggedItem?.id ?? idInEvent;
      if (!draggedId) return;

      const next = moveSection(sections, draggedId, targetArea, dragConfig.dragOverIndex);
      setSections(next);
      onSectionsChange(next);
      setDragConfig({ draggedItem: null, dragOverArea: null, dragOverIndex: null });
    },
    [dragConfig, sections, onSectionsChange]
  );

  const handleAreaToggle = useCallback((area: LayoutArea, enabled: boolean) => {
    const newAreas = {
      ...areas,
      [area]: { ...areas[area], enabled }
    };
    setAreas(newAreas);
    
    const structure = layoutStructure ?? template.layoutStructure;
    onLayoutChange({
      ...structure,
      areas: newAreas
    });
  }, [areas, layoutStructure, template.layoutStructure, onLayoutChange]);

  const handleSectionToggle = useCallback((sectionId: string, enabled: boolean) => {
    const updated = sections.map(s => s.id === sectionId ? { ...s, enabled } : s);
    setSections(updated);
    onSectionsChange(updated);
  }, [sections, onSectionsChange]);

  const handleRemoveSection = useCallback((sectionId: string) => {
    const updated = sections.map(s => 
      s.id === sectionId 
        ? { ...s, placement: 'unplaced' as SectionPlacement, enabled: false, area: 'floating' as LayoutArea, order: 0 }
        : s
    );
    setSections(updated);
    onSectionsChange(updated);
  }, [sections, onSectionsChange]);

  const layoutAreas: LayoutArea[] = ['header', 'sidebar-left', 'main', 'sidebar-right', 'footer'];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Constructor de Layout</h2>
            <p className="text-gray-600">Arrastra y suelta las secciones para personalizar tu diseño</p>
          </div>

          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2">
            <Eye size={16} />
            Vista Previa
          </button>
        </div>

        <div className="grid lg:grid-cols-4 gap-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-gray-800">Secciones Disponibles</h3>
              <span className="text-xs text-gray-500">({unplacedSections.length})</span>
            </div>

            <div className="space-y-2">
              {unplacedSections.map((section) => (
                <AvailableSectionCard
                  key={section.id}
                  section={section}
                  isDragging={dragConfig.draggedItem?.id === section.id}
                  onDragStart={beginDrag}
                  onDragEnd={endDrag}
                  onConfigure={setSelectedSection}
                />
              ))}
            </div>

            <button className="w-full border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-blue-400 hover:bg-blue-50 transition-colors">
              <Plus size={20} className="mx-auto mb-2 text-gray-400" />
              <span className="text-sm text-gray-600">Crear Sección Custom</span>
            </button>
          </div>

          <div className="lg:col-span-3">
            <h3 className="font-semibold text-gray-800 mb-4">Diseño del Portfolio</h3>
            
            <div className="bg-white border rounded-xl p-4 overflow-x-auto">
              <div
                className="grid gap-2 min-w-[900px]"
                style={{
                  gridTemplateAreas: `
                    "header header header"
                    "sidebar-left main sidebar-right"
                    "footer footer footer"
                  `,
                  gridTemplateColumns: '1fr 2fr 1fr',
                  gridTemplateRows: 'auto 1fr auto',
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
                        onDragLeave={() => setDragConfig((p) => ({ ...p, dragOverIndex: null }))}
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
          </div>
        </div>

        {selectedSection && (
          <div className="fixed inset-y-0 right-0 w-80 bg-white shadow-xl border-l z-50 p-6 overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">Configurar {selectedSection.name}</h3>
              <button onClick={() => setSelectedSection(null)} className="p-2 hover:bg-gray-100 rounded">
                <X size={16} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Variante</label>
                <select className="w-full border rounded-lg px-3 py-2">
                  <option value="default">Por Defecto</option>
                  <option value="compact">Compacta</option>
                  <option value="expanded">Expandida</option>
                  <option value="minimal">Mínimal</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Espaciado</label>
                <select className="w-full border rounded-lg px-3 py-2">
                  <option value="tight">Apretado</option>
                  <option value="normal">Normal</option>
                  <option value="normal">Amplio</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="rounded" />
                  <span className="text-sm">Mostrar título</span>
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="rounded" />
                  <span className="text-sm">Mostrar divisor</span>
                </label>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}