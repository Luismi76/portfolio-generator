// ============================================
// PASO 1: Crear src/components/TabNavigation.tsx (NUEVO ARCHIVO)
// ============================================
import React from 'react';
import { User, Code, Palette, Type, LayoutGrid, Cog, LucideIcon } from 'lucide-react';

export type TabId = 
  | "avatar" 
  | "layout" 
  | "colors" 
  | "typography" 
  | "sections" 
  | "advanced";

interface Tab {
  id: TabId;
  label: string;
  icon: LucideIcon;
}

interface TabNavigationProps {
  activeTab: TabId;
  onTabChange: (tab: TabId) => void;
  tabs?: Tab[];
}

const DEFAULT_TABS: Tab[] = [
  { id: "avatar", label: "Avatar", icon: User },
  { id: "layout", label: "Layout", icon: Code },
  { id: "colors", label: "Colores", icon: Palette },
  { id: "typography", label: "Tipografía", icon: Type },
  { id: "sections", label: "Secciones", icon: LayoutGrid },
  { id: "advanced", label: "Avanzado", icon: Cog },
];

export const TabNavigation: React.FC<TabNavigationProps> = ({
  activeTab,
  onTabChange,
  tabs = DEFAULT_TABS,
}) => {
  return (
    <div className="bg-white border-b sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex gap-2 overflow-x-auto">
          {tabs.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => onTabChange(id)}
              className={`
                flex items-center gap-2 px-4 py-2.5 rounded-lg transition-all text-sm font-medium
                whitespace-nowrap
                ${
                  activeTab === id
                    ? "bg-blue-600 text-white shadow-md"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }
              `}
            >
              <Icon size={16} />
              <span>{label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export { DEFAULT_TABS };
