// src/components/customizer/tabs/LayoutTab.tsx
import React from "react";
import {
  AdvancedTemplate,
  AdvancedTemplateConfig,
  Section,
  TemplateLayoutStructure,
  TemplateLayoutStructurePatch,
} from "../../../types/advanced-template-types";
import { AdvancedLayoutBuilder } from "../../layout-builder";

interface LayoutTabProps {
  template: AdvancedTemplate;
  currentConfig: AdvancedTemplateConfig;
  effectiveLayoutStructure: TemplateLayoutStructure;
  updateConfig: (updates: Partial<AdvancedTemplateConfig["customizations"]>) => void;
  updateSections: (sections: Section[]) => void;
}

/**
 * Tab de configuración del layout
 * Wrapper para el componente AdvancedLayoutBuilder
 */
export const LayoutTab: React.FC<LayoutTabProps> = ({
  template,
  currentConfig,
  effectiveLayoutStructure,
  updateConfig,
  updateSections,
}) => {
  return (
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
  );
};
