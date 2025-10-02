import React, { useState, useCallback, useMemo } from "react";
import {
  AdvancedTemplate,
  AdvancedTemplateConfig,
  Section,
  TemplateLayoutStructure,
  TemplateLayoutStructurePatch,
  AREA_KEYS
} from "../types/advanced-template-types";
import { AdvancedLayoutBuilder } from "./AdvancedLayoutBuilder";
import { Icons } from "./portfolio-icons";
import { TabNavigation, TabId } from "./TabNavigation";
import TypographyControls from './TypographyControls';

interface Props {
  template: AdvancedTemplate;
  config: AdvancedTemplateConfig;
  onConfigChange: (config: AdvancedTemplateConfig) => void;
  onPreview: () => void;
  onSave: () => void;
  onCancel: () => void;
  onReset: () => void;
}

type CustomizerTab = TabId;



// ===== mergeLayoutStructure (seguro) =====
function mergeLayoutStructure(
  base: TemplateLayoutStructure,
  custom?: TemplateLayoutStructurePatch
): TemplateLayoutStructure {
  const baseAreas = (base?.areas ??
    {}) as Required<TemplateLayoutStructure>["areas"];
  const mergedAreas = AREA_KEYS.reduce((acc, key) => {
    acc[key] = { ...(baseAreas?.[key] ?? {}), ...(custom?.areas?.[key] ?? {}) };
    return acc;
  }, {} as Required<TemplateLayoutStructure>["areas"]);

  const baseResp =
    base?.responsive ?? ({ mobile: "stack", tablet: "full" } as const);
  const responsive = custom?.responsive
    ? {
        mobile: custom.responsive.mobile ?? baseResp.mobile,
        tablet: custom.responsive.tablet ?? baseResp.tablet,
      }
    : baseResp;

  return {
    ...(base ?? {}),
    type: custom?.type ?? base?.type,
    areas: mergedAreas,
    responsive,
  };
}

// ===== ColorPicker =====
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
            <Icons.ChevronDown size={14} />
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


// ===== SpacingControls =====
const SpacingControls: React.FC<{
  spacing: any;
  onChange: (spacing: any) => void;
}> = ({ spacing, onChange }) => {
  const getInitialLevel = () => {
    const mdValue = spacing?.md || "1.5rem";
    const parsed = parseFloat(mdValue);
    if (mdValue.includes("rem")) {
      return parsed;
    } else if (mdValue.includes("px")) {
      return parsed / 16;
    }
    return 1.5;
  };

  const [spacingLevel, setSpacingLevel] = useState(getInitialLevel);

  const spacingRatios = {
    xs: 0.33,
    sm: 0.67,
    md: 1,
    lg: 1.33,
    xl: 2,
    "2xl": 2.67,
  };

  const handleSpacingChange = (newLevel: number) => {
    setSpacingLevel(newLevel);

    const newSpacing = {
      xs: `${(newLevel * spacingRatios.xs).toFixed(2)}rem`,
      sm: `${(newLevel * spacingRatios.sm).toFixed(2)}rem`,
      md: `${(newLevel * spacingRatios.md).toFixed(2)}rem`,
      lg: `${(newLevel * spacingRatios.lg).toFixed(2)}rem`,
      xl: `${(newLevel * spacingRatios.xl).toFixed(2)}rem`,
      "2xl": `${(newLevel * spacingRatios["2xl"]).toFixed(2)}rem`,
    };

    onChange(newSpacing);
  };

  const presets = [
    { label: "Muy Compacto", value: 0.5 },
    { label: "Compacto", value: 1 },
    { label: "Normal", value: 1.5 },
    { label: "Espaciado", value: 2 },
    { label: "Muy Espaciado", value: 3 },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-medium text-gray-700">Espaciado General</h4>
        <span className="text-xs text-gray-500">
          {spacingLevel.toFixed(2)}rem
        </span>
      </div>

      <div className="space-y-2">
        <input
          type="range"
          aria-label="Nivel de espaciado general"
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          min={0.25}
          max={4}
          step={0.25}
          value={spacingLevel}
          onChange={(e) => handleSpacingChange(parseFloat(e.target.value))}
        />

        <div className="flex justify-between text-xs text-gray-500">
          <span>Compacto</span>
          <span>Normal</span>
          <span>Espaciado</span>
        </div>
      </div>

      <div className="flex gap-2 flex-wrap">
        {presets.map((preset) => (
          <button
            key={preset.label}
            onClick={() => handleSpacingChange(preset.value)}
            className={`px-3 py-1 rounded-lg text-xs transition-colors ${
              Math.abs(spacingLevel - preset.value) < 0.1
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            {preset.label}
          </button>
        ))}
      </div>

      <details className="mt-4">
        <summary className="text-xs text-gray-500 cursor-pointer hover:text-gray-700">
          Ver valores específicos
        </summary>
        <div className="mt-2 grid grid-cols-3 gap-2 text-xs">
          {Object.entries(spacingRatios).map(([key, ratio]) => (
            <div key={key} className="bg-gray-50 rounded p-2">
              <span className="text-gray-600">{key}:</span>
              <span className="ml-1 font-mono text-gray-800">
                {(spacingLevel * ratio).toFixed(2)}rem
              </span>
            </div>
          ))}
        </div>
      </details>

      <p className="text-[11px] text-gray-500 mt-2">
        Ajusta el espaciado general de la plantilla. Todos los tamaños se
        escalan proporcionalmente.
      </p>
    </div>
  );
};

// ===== Componente principal =====
export const AdvancedTemplateCustomizer: React.FC<Props> = ({
  template,
  config,
  onConfigChange,
  onPreview,
  onSave,
  onCancel,
  onReset,
}) => {
  const [activeTab, setActiveTab] = useState<CustomizerTab>("avatar");
  
  const currentConfig = useMemo(
    () => ({
      ...config,
      customizations: {
        ...config.customizations,
        layout: {
          ...(template?.layout ?? {}),
          ...(config?.customizations?.layout ?? {}),
        },
        colors: {
          ...(template?.colors ?? {}),
          ...(config?.customizations?.colors ?? {}),
        },
        typography: {
          ...(template?.typography ?? {}),
          ...(config?.customizations?.typography ?? {}),
        },
        sections:
          config?.customizations?.sections && config.templateId === template.id
            ? config.customizations.sections
            : template?.sections ?? [],
      },
    }),
    [config, template]
  );

  const updateConfig = useCallback(
    (updates: Partial<AdvancedTemplateConfig["customizations"]>) => {
      const newConfig: AdvancedTemplateConfig = {
        ...currentConfig,
        customizations: {
          ...currentConfig.customizations,
          ...updates,
        },
        lastModified: new Date().toISOString(),
      };
      onConfigChange(newConfig);
    },
    [currentConfig, onConfigChange]
  );

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

  const updateSections = useCallback(
    (sections: Section[]) => {
      updateConfig({ sections });
    },
    [updateConfig]
  );

  const effectiveLayoutStructure: TemplateLayoutStructure = useMemo(() => {
    const baseLS: TemplateLayoutStructure = template?.layoutStructure ?? {
      type: "single-column",
      areas: {} as TemplateLayoutStructure["areas"],
      responsive: {
        mobile: "stack",
        tablet: "full",
      },
    };

    return mergeLayoutStructure(
      baseLS,
      currentConfig.customizations.layoutStructure
    );
  }, [template?.layoutStructure, currentConfig.customizations.layoutStructure]);

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

  const renderTabContent = () => {
    switch (activeTab) {
      case "avatar":
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Configuración del Avatar
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                Personaliza tu foto de perfil
              </p>
            </div>

            <div className="border rounded-lg p-4">
              <h4 className="font-medium mb-3">Avatar/Foto de Perfil</h4>
              <div className="space-y-3">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={
                      currentConfig.customizations.headerConfig?.showAvatar ||
                      false
                    }
                    onChange={(e) =>
                      updateConfig({
                        headerConfig: {
                          ...(currentConfig.customizations.headerConfig ?? {}),
                          showAvatar: e.target.checked,
                        },
                      })
                    }
                  />
                  <span className="text-sm">Mostrar avatar/foto</span>
                </label>

                {currentConfig.customizations.headerConfig?.showAvatar && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        URL de la imagen
                      </label>
                      <input
                        type="url"
                        placeholder="https://ejemplo.com/mi-foto.jpg"
                        value={
                          currentConfig.customizations.headerConfig
                            ?.avatarUrl || ""
                        }
                        onChange={(e) =>
                          updateConfig({
                            headerConfig: {
                              ...(currentConfig.customizations.headerConfig ??
                                {}),
                              avatarUrl: e.target.value,
                            },
                          })
                        }
                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Sube tu imagen a Imgur o ImgBB y pega la URL aquí
                      </p>
                    </div>

                    {currentConfig.customizations.headerConfig?.avatarUrl && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Vista previa
                        </label>
                        <div className="flex justify-center">
                          <img
                            src={
                              currentConfig.customizations.headerConfig
                                .avatarUrl
                            }
                            alt="Avatar preview"
                            className="w-32 h-32 rounded-full object-cover border-4 border-gray-200"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.style.display = "none";
                            }}
                          />
                        </div>
                      </div>
                    )}

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Posición del avatar
                      </label>
                      <select
                        value={
                          currentConfig.customizations.headerConfig
                            ?.avatarPosition || "center"
                        }
                        onChange={(e) =>
                          updateConfig({
                            headerConfig: {
                              ...(currentConfig.customizations.headerConfig ??
                                {}),
                              avatarPosition: e.target.value as
                                | "left"
                                | "center"
                                | "right",
                            },
                          })
                        }
                        className="w-full px-3 py-2 border rounded-lg"
                      >
                        <option value="left">Izquierda</option>
                        <option value="center">Centro</option>
                        <option value="right">Derecha</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Tamaño del avatar
                      </label>
                      <select
                        value={
                          currentConfig.customizations.headerConfig
                            ?.avatarSize || "md"
                        }
                        onChange={(e) =>
                          updateConfig({
                            headerConfig: {
                              ...(currentConfig.customizations.headerConfig ??
                                {}),
                              avatarSize: e.target.value as "sm" | "md" | "lg",
                            },
                          })
                        }
                        className="w-full px-3 py-2 border rounded-lg"
                      >
                        <option value="sm">Pequeño (80px)</option>
                        <option value="md">Mediano (120px)</option>
                        <option value="lg">Grande (160px)</option>
                      </select>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        );

      case "layout":
        return (
          <>
            <AdvancedLayoutBuilder
              template={{
                ...template,
                layoutStructure: effectiveLayoutStructure,
              }}
              sections={currentConfig.customizations.sections || []}
              onSectionsChange={updateSections}
              onLayoutChange={(structure: TemplateLayoutStructurePatch) =>
                updateConfig({
                  layoutStructure: structure,
                })
              }
              layoutStructure={effectiveLayoutStructure}
              config={currentConfig}
              onConfigUpdate={(updates) => {
                updateConfig(updates);
              }}
            />
          </>
        );

      case "colors":
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="space-y-3">
                <h3 className="font-medium text-gray-800">
                  Colores Principales
                </h3>
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
                            ...(currentConfig.customizations.colors
                              ?.gradients ?? {}),
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
                        currentConfig.customizations.colors?.gradients?.primary
                          ?.to || ""
                      }
                      onChange={(c) =>
                        updateColors({
                          gradients: {
                            ...(currentConfig.customizations.colors
                              ?.gradients ?? {}),
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

      case "typography":
        return (
          <TypographyControls
            typography={
              currentConfig.customizations.typography ||
              template?.typography ||
              {}
            }
            onChange={(typography) => updateConfig({ typography })}
          />
        );

      case "sections":
        return (
          <div className="space-y-4">
            <h3 className="font-medium text-gray-800">
              Configuración de Secciones
            </h3>
            <div className="space-y-3">
              {(
                currentConfig.customizations.sections ||
                template?.sections ||
                []
              ).map((section) => (
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
                          const updated = (
                            currentConfig.customizations.sections ||
                            template?.sections ||
                            []
                          ).map((s) =>
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
                          const updated = (
                            currentConfig.customizations.sections ||
                            template?.sections ||
                            []
                          ).map((s) =>
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
                          const updated = (
                            currentConfig.customizations.sections ||
                            template?.sections ||
                            []
                          ).map((s) =>
                            s.id === section.id
                              ? {
                                  ...s,
                                  config: {
                                    ...(s.config ?? {}),
                                    columns: Number(e.target.value) as
                                      | 1
                                      | 2
                                      | 3
                                      | 4,
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

      case "advanced":
        return (
          <div className="space-y-6">
            <div className="space-y-4">
              <h3 className="font-medium text-gray-800">
                Configuración Avanzada
              </h3>

              {/* Animaciones */}
              <div className="border rounded-lg p-4">
                <h4 className="font-medium mb-3">Animaciones</h4>
                <div className="space-y-3">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={
                        currentConfig.customizations.animations?.enabled ||
                        false
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
                          currentConfig.customizations.animations?.type ||
                          "subtle"
                        }
                        onChange={(e) =>
                          updateConfig({
                            animations: {
                              ...(currentConfig.customizations.animations ??
                                {}),
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
                              currentConfig.customizations.darkMode?.auto ||
                              false,
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

      default:
        return null;
    }
  };

  return (


      <div className="min-h-screen bg-gray-50">
    <TabNavigation 
      activeTab={activeTab}
      onTabChange={setActiveTab}
    />
    
    <div className="max-w-7xl mx-auto px-4 py-4">
      {renderTabContent()}
    </div>
  </div>

  );
};

export default AdvancedTemplateCustomizer;