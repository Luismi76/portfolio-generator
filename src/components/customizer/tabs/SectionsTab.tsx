// src/components/customizer/tabs/SectionsTab.tsx
import React from "react";
import {
  AdvancedTemplate,
  AdvancedTemplateConfig,
  Section,
} from "../../../types/advanced-template-types";

interface SectionsTabProps {
  template: AdvancedTemplate;
  currentConfig: AdvancedTemplateConfig;
  updateSections: (sections: Section[]) => void;
}

/**
 * Tab de configuración de secciones
 * Permite habilitar/deshabilitar y configurar cada sección
 */
export const SectionsTab: React.FC<SectionsTabProps> = ({
  template,
  currentConfig,
  updateSections,
}) => {
  const sections =
    currentConfig.customizations.sections || template?.sections || [];

  return (
    <div className="space-y-4">
      <h3 className="font-medium text-gray-800">Configuración de Secciones</h3>
      
      <div className="space-y-3">
        {sections.map((section) => (
          <div key={section.id} className="border rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="text-lg">{section.icon}</span>
                <span className="font-medium">{section.name}</span>
              </div>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={!!section.enabled}
                  onChange={(e) => {
                    const updated = sections.map((s) =>
                      s.id === section.id
                        ? { ...s, enabled: e.target.checked }
                        : s
                    );
                    updateSections(updated);
                  }}
                />
                <span className="text-sm">Visible</span>
              </label>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Variante
                </label>
                <select
                  value={section?.config?.variant || "default"}
                  onChange={(e) => {
                    const updated = sections.map((s) =>
                      s.id === section.id
                        ? {
                            ...s,
                            config: {
                              ...(s.config ?? {}),
                              variant: e.target.value as
                                | "default"
                                | "compact"
                                | "expanded"
                                | "minimal",
                            },
                          }
                        : s
                    );
                    updateSections(updated);
                  }}
                  className="w-full px-2 py-1 border rounded"
                >
                  <option value="default">Por Defecto</option>
                  <option value="compact">Compacta</option>
                  <option value="expanded">Expandida</option>
                  <option value="minimal">Mínimal</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Columnas
                </label>
                <select
                  value={section?.config?.columns || 1}
                  onChange={(e) => {
                    const updated = sections.map((s) =>
                      s.id === section.id
                        ? {
                            ...s,
                            config: {
                              ...(s.config ?? {}),
                              columns: Number(e.target.value) as 1 | 2 | 3 | 4,
                            },
                          }
                        : s
                    );
                    updateSections(updated);
                  }}
                  className="w-full px-2 py-1 border rounded"
                >
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                </select>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};