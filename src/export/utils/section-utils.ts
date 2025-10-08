// src/export/utils/section-utils.ts
import { Template, TemplateConfig } from "@/types/template-types";
import type {
  AdvancedTemplate,
  AdvancedTemplateConfig,
} from "@/types/advanced-template-types";

type SectionLike = { id: string; enabled: boolean; order: number };

/**
 * Obtiene las secciones habilitadas de un template, ordenadas
 */
export const getEnabledSections = (
  template: Template | AdvancedTemplate,
  config?: TemplateConfig | AdvancedTemplateConfig
): SectionLike[] => {
  const customSections = (config as any)?.customizations?.sections;
  const base = customSections && Array.isArray(customSections)
    ? customSections
    : ((template as any).sections || []);
    
  return (base as SectionLike[])
    .filter((s) => s.enabled === true)
    .sort((a, b) => a.order - b.order);
};

/**
 * Verifica si la sección "about" está habilitada
 */
export const isAboutSectionEnabled = (
  template: Template | AdvancedTemplate,
  config?: TemplateConfig | AdvancedTemplateConfig
): boolean => {
  const sections: SectionLike[] =
    (config as any)?.customizations?.sections ||
    ((template as any).sections as SectionLike[]) ||
    [];
  const aboutSection = sections.find((section) => section.id === "about");
  return aboutSection?.enabled ?? false;
};