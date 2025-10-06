// src/components/template-renderer/components/SectionRenderer.tsx
import React from "react";
import type { PortfolioData, Project } from "../../../types/portfolio-types";
import type {
  AdvancedTemplate,
  AdvancedTemplateConfig,
  Section as AdvSection,
  LayoutArea,
} from "../../../types/advanced-template-types";
import type { TemplateSection } from "../../../types/template-types";
import { normalizeSectionId } from "../../../utils/template-utils";
import {
  HeaderSection,
  AboutSection,
  ProjectsSection,
  SkillsSection,
  ExperienceSection,
  FooterSection,
} from "../sections";

interface SectionRendererProps {
  area: LayoutArea;
  sections: AdvSection[];
  data: PortfolioData;
  config?: AdvancedTemplateConfig;
  template?: AdvancedTemplate;
  isSSR?: boolean;
  onOpenProject?: (project: Project) => void;
  flatSections?: TemplateSection[];
  advancedSections?: AdvSection[];
}

/**
 * Renderiza una sección específica según su ID/tipo
 */
function renderSectionById(
  id: string,
  name: string,
  data: PortfolioData,
  config?: AdvancedTemplateConfig,
  template?: AdvancedTemplate,
  isSSR?: boolean,
  onOpenProject?: (project: Project) => void,
  flatSections?: TemplateSection[],
  advancedSections?: AdvSection[]
): React.ReactNode {
  switch (id) {
    case "header":
      return <HeaderSection data={data} config={config} template={template} />;
    
    case "about":
      return <AboutSection data={data} />;
    
    case "projects":
      return (
        <ProjectsSection
          data={data}
          advancedSections={advancedSections}
          flatSections={flatSections || []}
          isSSR={isSSR}
          onOpenProject={onOpenProject}
        />
      );
    
    case "skills":
      return (
        <SkillsSection
          data={data}
          advancedSections={advancedSections}
          flatSections={flatSections || []}
        />
      );
    
    case "experience":
      return <ExperienceSection data={data} />;
    
    case "contact":
      return <FooterSection data={data} config={config} template={template} />;
    
    default:
      return null;
  }
}

/**
 * Componente que renderiza múltiples secciones de un área específica
 * Actúa como orquestador que delega a los componentes de sección específicos
 */
export const SectionRenderer: React.FC<SectionRendererProps> = ({
  sections,
  data,
  config,
  template,
  isSSR,
  onOpenProject,
  flatSections,
  advancedSections,
}) => {
  if (sections.length === 0) return null;

  return (
    <>
      {sections
        .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
        .map((section) => {
          const id = normalizeSectionId(section.id ?? section.type);
          const variant = section.config?.variant || "default";
          const variantClass = variant !== "default" ? `variant-${variant}` : "";

          return (
            <div key={section.id} className={variantClass}>
              {renderSectionById(
                id,
                section.name,
                data,
                config,
                template,
                isSSR,
                onOpenProject,
                flatSections,
                advancedSections
              )}
            </div>
          );
        })}
    </>
  );
};