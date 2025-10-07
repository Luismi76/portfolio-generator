// src/components/customizer/tabs/ColorsTab.tsx
import React, { useCallback } from "react";
import {
  AdvancedTemplate,
  AdvancedTemplateConfig,
} from "../../../types/advanced-template-types";
import { ColorPicker } from "../controls/ColorPicker";

interface ColorsTabProps {
  template: AdvancedTemplate;
  currentConfig: AdvancedTemplateConfig;
  updateConfig: (updates: Partial<AdvancedTemplateConfig["customizations"]>) => void;
}

/**
 * Tab de configuración de colores
 * Permite personalizar todos los colores del template
 */
export const ColorsTab: React.FC<ColorsTabProps> = ({
  template,
  currentConfig,
  updateConfig,
}) => {
  const colorPresets = [
    "#3B82F6",
    "#6366F1",
    "#8B5CF6",
    "#EC4899",
    "#EF4444",
    "#F59E0B",
    "#10B981",
    "#06B6D4",
    "#84CC16",
    "#6B7280",
  ];

  const updateColors = useCallback(
    (colorUpdates: any) => {
      updateConfig({
        colors: {
          ...(currentConfig.customizations.colors ?? {}),
          ...(colorUpdates ?? {}),
        },
      });
    },
    [currentConfig.customizations.colors, updateConfig]
  );

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Colores Principales */}
        <div className="space-y-3">
          <h3 className="font-medium text-gray-800">Colores Principales</h3>
          
          <ColorPicker
            label="Primario"
            value={
              currentConfig.customizations.colors?.primary ||
              template?.colors?.primary ||
              "#3B82F6"
            }
            onChange={(c) => updateColors({ primary: c })}
            presets={colorPresets}
          />
          
          <ColorPicker
            label="Secundario"
            value={
              currentConfig.customizations.colors?.secondary ||
              template?.colors?.secondary ||
              "#6366F1"
            }
            onChange={(c) => updateColors({ secondary: c })}
            presets={colorPresets}
          />
          
          <ColorPicker
            label="Acento"
            value={
              currentConfig.customizations.colors?.accent ||
              template?.colors?.accent ||
              "#EF4444"
            }
            onChange={(c) => updateColors({ accent: c })}
            presets={colorPresets}
          />
        </div>

        {/* Superficies */}
        <div className="space-y-3">
          <h3 className="font-medium text-gray-800">Superficies</h3>
          
          <ColorPicker
            label="Fondo"
            value={
              currentConfig.customizations.colors?.background ||
              template?.colors?.background ||
              "#ffffff"
            }
            onChange={(c) => updateColors({ background: c })}
          />
          
          <ColorPicker
            label="Superficie"
            value={
              currentConfig.customizations.colors?.surface ||
              template?.colors?.surface ||
              "#f7f7f9"
            }
            onChange={(c) => updateColors({ surface: c })}
          />
          
          <ColorPicker
            label="Superficie Variante"
            value={
              currentConfig.customizations.colors?.surfaceVariant ||
              template?.colors?.surfaceVariant ||
              "#eeeeee"
            }
            onChange={(c) => updateColors({ surfaceVariant: c })}
          />
        </div>

        {/* Texto */}
        <div className="space-y-3">
          <h3 className="font-medium text-gray-800">Texto</h3>
          
          <ColorPicker
            label="Texto Principal"
            value={
              currentConfig.customizations.colors?.text?.primary ||
              template?.colors?.text?.primary ||
              "#0f172a"
            }
            onChange={(c) =>
              updateColors({
                text: {
                  ...(currentConfig.customizations.colors?.text ?? {}),
                  primary: c,
                },
              })
            }
          />
          
          <ColorPicker
            label="Texto Secundario"
            value={
              currentConfig.customizations.colors?.text?.secondary ||
              template?.colors?.text?.secondary ||
              "#64748b"
            }
            onChange={(c) =>
              updateColors({
                text: {
                  ...(currentConfig.customizations.colors?.text ?? {}),
                  secondary: c,
                },
              })
            }
          />
          
          <ColorPicker
            label="Texto de Acento"
            value={
              currentConfig.customizations.colors?.text?.accent ||
              template?.colors?.text?.accent ||
              "#ffffff"
            }
            onChange={(c) =>
              updateColors({
                text: {
                  ...(currentConfig.customizations.colors?.text ?? {}),
                  accent: c,
                },
              })
            }
          />
        </div>
      </div>

      {/* Gradientes */}
      <div className="border-t pt-6">
        <h3 className="font-medium text-gray-800 mb-4">Gradientes</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-gray-700">
              Gradiente Primario
            </h4>
            <div className="grid grid-cols-2 gap-2">
              <ColorPicker
                label="Desde"
                value={
                  currentConfig.customizations.colors?.gradients?.primary
                    ?.from || ""
                }
                onChange={(c) =>
                  updateColors({
                    gradients: {
                      ...(currentConfig.customizations.colors?.gradients ?? {}),
                      primary: {
                        ...(currentConfig.customizations.colors?.gradients
                          ?.primary ?? {}),
                        from: c,
                      },
                    },
                  })
                }
              />
              <ColorPicker
                label="Hacia"
                value={
                  currentConfig.customizations.colors?.gradients?.primary?.to ||
                  ""
                }
                onChange={(c) =>
                  updateColors({
                    gradients: {
                      ...(currentConfig.customizations.colors?.gradients ?? {}),
                      primary: {
                        ...(currentConfig.customizations.colors?.gradients
                          ?.primary ?? {}),
                        to: c,
                      },
                    },
                  })
                }
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};