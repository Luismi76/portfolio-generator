// src/components/template-renderer/hooks/useSectionGroups.ts
import { useMemo } from "react";
import type {
  AdvancedTemplate,
  AdvancedTemplateConfig,
  Section as AdvSection,
  LayoutArea,
} from "../../../types/advanced-template-types";
import type { TemplateSection } from "../../../types/template-types";
import { groupSectionsByArea, toTemplateSections } from "../../../utils/template-utils";

/**
 * Hook para agrupar y normalizar secciones del template
 * @param config - Configuración del template
 * @param template - Template avanzado
 * @returns Secciones agrupadas por área y en formato flat
 */
export function useSectionGroups(
  config?: AdvancedTemplateConfig,
  template?: AdvancedTemplate
) {
  const advancedSections = useMemo<AdvSection[] | undefined>(() => {
    const fromConfig = config?.customizations?.sections;
    return (fromConfig && fromConfig.length ? fromConfig : template?.sections) ?? [];
  }, [config?.customizations?.sections, template?.sections]);

  const byArea = useMemo<Record<LayoutArea, AdvSection[]>>(
    () => groupSectionsByArea(advancedSections),
    [advancedSections]
  );

  const flatSections = useMemo<TemplateSection[]>(
    () => toTemplateSections(advancedSections),
    [advancedSections]
  );

  return { advancedSections, byArea, flatSections };
}