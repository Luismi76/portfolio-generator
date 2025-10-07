// src/components/customizer/tabs/AdvancedTab.tsx
import React from "react";
import {
  AdvancedTemplate,
  AdvancedTemplateConfig,
} from "../../../types/advanced-template-types";
import { SpacingControls } from "../controls/SpacingControls";

interface AdvancedTabProps {
  template: AdvancedTemplate;
  currentConfig: AdvancedTemplateConfig;
  updateConfig: (updates: Partial<AdvancedTemplateConfig["customizations"]>) => void;
}

/**
 * Tab de configuración avanzada
 * Incluye animaciones, modo oscuro, CSS personalizado y espaciado
 */
export const AdvancedTab: React.FC<AdvancedTabProps> = ({
  template,
  currentConfig,
  updateConfig,
}) => {
  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="font-medium text-gray-800">Configuración Avanzada</h3>

        {/* Animaciones */}
        <div className="border rounded-lg p-4">
          <h4 className="font-medium mb-3">Animaciones</h4>
          <div className="space-y-3">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={
                  currentConfig.customizations.animations?.enabled || false
                }
                onChange={(e) =>
                  updateConfig({
                    animations: {
                      ...(currentConfig.customizations.animations ?? {}),
                      enabled: e.target.checked,
                    },
                  })
                }
              />
              <span className="text-sm">Habilitar animaciones</span>
            </label>

            {currentConfig.customizations.animations?.enabled && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tipo de animación
                </label>
                <select
                  value={
                    currentConfig.customizations.animations?.type || "subtle"
                  }
                  onChange={(e) =>
                    updateConfig({
                      animations: {
                        ...(currentConfig.customizations.animations ?? {}),
                        enabled: true,
                        type: e.target.value as
                          | "none"
                          | "subtle"
                          | "smooth"
                          | "dynamic",
                      },
                    })
                  }
                  className="w-full px-3 py-2 border rounded-lg"
                >
                  <option value="none">Sin animaciones</option>
                  <option value="subtle">Sutiles</option>
                  <option value="smooth">Suaves</option>
                  <option value="dynamic">Dinámicas</option>
                </select>
              </div>
            )}
          </div>
        </div>

        {/* Modo Oscuro */}
        <div className="border rounded-lg p-4">
          <h4 className="font-medium mb-3">Modo Oscuro</h4>
          <div className="space-y-3">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={
                  currentConfig.customizations.darkMode?.enabled || false
                }
                onChange={(e) =>
                  updateConfig({
                    darkMode: {
                      ...(currentConfig.customizations.darkMode ?? {}),
                      enabled: e.target.checked,
                      auto:
                        currentConfig.customizations.darkMode?.auto || false,
                    },
                  })
                }
              />
              <span className="text-sm">Soportar modo oscuro</span>
            </label>

            {currentConfig.customizations.darkMode?.enabled && (
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={
                    currentConfig.customizations.darkMode?.auto || false
                  }
                  onChange={(e) =>
                    updateConfig({
                      darkMode: {
                        ...(currentConfig.customizations.darkMode ?? {}),
                        enabled: true,
                        auto: e.target.checked,
                      },
                    })
                  }
                />
                <span className="text-sm">Detección automática</span>
              </label>
            )}
          </div>
        </div>

        {/* CSS Personalizado */}
        <div className="border rounded-lg p-4">
          <h4 className="font-medium mb-3">CSS Personalizado</h4>
          <textarea
            value={currentConfig.customizations.customCSS || ""}
            onChange={(e) => updateConfig({ customCSS: e.target.value })}
            placeholder="/* Agrega tu CSS personalizado aquí */"
            rows={8}
            className="w-full px-3 py-2 border rounded-lg font-mono text-sm focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Espaciado */}
        <div className="border rounded-lg p-4">
          <h4 className="font-medium mb-3">Espaciado</h4>
          <SpacingControls
            spacing={
              currentConfig.customizations.layout?.spacing ??
              template?.layout?.spacing ??
              {}
            }
            onChange={(spacing) =>
              updateConfig({
                layout: {
                  ...(currentConfig.customizations.layout ?? {}),
                  spacing,
                },
              })
            }
          />
        </div>
      </div>
    </div>
  );
};