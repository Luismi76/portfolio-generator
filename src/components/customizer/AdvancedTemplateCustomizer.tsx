// src/components/customizer/AdvancedTemplateCustomizer.tsx
import React, { useState, useCallback, useMemo } from "react";
import {
  AdvancedTemplate,
  AdvancedTemplateConfig,
  Section,
  TemplateLayoutStructure,
} from "../../types/advanced-template-types";
import { TabNavigation, TabId } from "../TabNavigation";
import { mergeLayoutStructure } from "./utils/layout-utils";

// Importar todos los tabs
import { AvatarTab } from "./tabs/AvatarTab";
import { LayoutTab } from "./tabs/LayoutTab";
import { ColorsTab } from "./tabs/ColorsTab";
import { TypographyTab } from "./tabs/TypographyTab";
import { SectionsTab } from "./tabs/SectionsTab";
import { AdvancedTab } from "./tabs/AdvancedTab";

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

/**
 * Componente principal del customizador de templates avanzados
 * Orquesta todos los tabs y maneja el estado de configuración
 */
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

  // Config actual con merge de template + customizations
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

  // Actualizar configuración
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

  // Actualizar secciones
  const updateSections = useCallback(
    (sections: Section[]) => {
      updateConfig({ sections });
    },
    [updateConfig]
  );

  // Layout efectivo con merge
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

  // Renderizar contenido del tab activo
  const renderTabContent = () => {
    switch (activeTab) {
      case "avatar":
        return (
          <AvatarTab
            currentConfig={currentConfig}
            updateConfig={updateConfig}
          />
        );

      case "layout":
        return (
          <LayoutTab
            template={template}
            currentConfig={currentConfig}
            effectiveLayoutStructure={effectiveLayoutStructure}
            updateConfig={updateConfig}
            updateSections={updateSections}
          />
        );

      case "colors":
        return (
          <ColorsTab
            template={template}
            currentConfig={currentConfig}
            updateConfig={updateConfig}
          />
        );

      case "typography":
        return (
          <TypographyTab
            template={template}
            currentConfig={currentConfig}
            updateConfig={updateConfig}
          />
        );

      case "sections":
        return (
          <SectionsTab
            template={template}
            currentConfig={currentConfig}
            updateSections={updateSections}
          />
        );

      case "advanced":
        return (
          <AdvancedTab
            template={template}
            currentConfig={currentConfig}
            updateConfig={updateConfig}
          />
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />

      <div className="max-w-7xl mx-auto px-4 py-4">
        {renderTabContent()}
      </div>
    </div>
  );
};

export default AdvancedTemplateCustomizer;