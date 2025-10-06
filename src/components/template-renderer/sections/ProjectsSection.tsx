// src/components/template-renderer/sections/ProjectsSection.tsx
import React from "react";
import type { PortfolioData, Project } from "../../../types/portfolio-types";
import type { Section as AdvSection } from "../../../types/advanced-template-types";
import type { TemplateSection } from "../../../types/template-types";
import { ProjectCard } from "../components/ProjectCard";
import { normalizeSectionId } from "../../../utils/template-utils";

interface ProjectsSectionProps {
  data: PortfolioData;
  advancedSections?: AdvSection[];
  flatSections: TemplateSection[];
  isSSR?: boolean;
  onOpenProject?: (project: Project) => void;
}

/**
 * Sección de Proyectos del portfolio
 * Muestra una grid de cards de proyectos con columnas configurables
 */
export const ProjectsSection: React.FC<ProjectsSectionProps> = ({
  data,
  advancedSections,
  flatSections,
  isSSR = false,
  onOpenProject,
}) => {
  // Filtrar proyectos válidos
  const validProjects = data.projects.filter((p) => p.title?.trim());
  
  if (validProjects.length === 0) return null;

  // Obtener número de columnas desde configuración
  const advProj = advancedSections?.find(
    (s) => normalizeSectionId(s.id) === "projects"
  );
  const gridColsFromAdv = Number(advProj?.config?.columns ?? 0);
  const gridColsFromLegacy = Number(
    flatSections.find((s) => s.id === "projects")?.props?.gridCols ?? 0
  );
  const gridCols = Math.max(
    2,
    Math.min(4, gridColsFromAdv || gridColsFromLegacy || 3)
  );

  return (
    <section
      id="projects"
      style={{ 
        paddingTop: "var(--sp-lg)", 
        paddingBottom: "var(--sp-lg)" 
      }}
      aria-labelledby="projects-title"
    >
      <div className="tpl-container">
        <h2
          id="projects-title"
          className="tpl-heading"
          style={{ 
            fontSize: "var(--fs-2xl)", 
            marginBottom: "var(--sp-md)" 
          }}
        >
          Proyectos
        </h2>

        <div
          className="projects-grid"
          style={{
            display: "grid",
            gap: "var(--sp-md)",
            gridTemplateColumns: `repeat(${gridCols}, minmax(0, 1fr))`,
            alignItems: "stretch",
          }}
        >
          {validProjects.map((project, idx) => (
            <ProjectCard
              key={idx}
              project={project}
              isSSR={isSSR}
              onOpenProject={onOpenProject}
            />
          ))}
        </div>
      </div>
    </section>
  );
};