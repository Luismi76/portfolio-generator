// src/components/template-renderer/sections/SkillsSection.tsx
import React from "react";
import type { PortfolioData } from "../../../types/portfolio-types";
import type { Section as AdvSection } from "../../../types/advanced-template-types";
import type { TemplateSection } from "../../../types/template-types";
import { TechList } from "../../TechIcons";
import { normalizeSectionId } from "../../../utils/template-utils";

interface SkillsSectionProps {
  data: PortfolioData;
  advancedSections?: AdvSection[];
  flatSections: TemplateSection[];
}

/**
 * Sección de Habilidades del portfolio
 * Muestra las habilidades agrupadas por categoría en una grid configurable
 */
export const SkillsSection: React.FC<SkillsSectionProps> = ({
  data,
  advancedSections,
  flatSections,
}) => {
  // Filtrar skills válidas
  const validSkills = data.skills.filter((s) => s.category.trim());
  
  if (validSkills.length === 0) return null;

  // Obtener número de columnas desde configuración
  const advSkills = advancedSections?.find(
    (s) => normalizeSectionId(s.id) === "skills"
  );
  const gridColsFromAdv = Number(advSkills?.config?.columns ?? 0);
  const gridColsFromLegacy = Number(
    flatSections.find((s) => s.id === "skills")?.props?.gridCols ?? 0
  );
  const gridCols = Math.max(
    1,
    Math.min(4, gridColsFromAdv || gridColsFromLegacy || 2)
  );

  return (
    <section
      style={{ 
        paddingTop: "var(--sp-lg)", 
        paddingBottom: "var(--sp-lg)" 
      }}
    >
      <div className="tpl-container">
        <h2
          className="tpl-heading"
          style={{ 
            fontSize: "var(--fs-2xl)", 
            marginBottom: "var(--sp-md)" 
          }}
        >
          Habilidades
        </h2>

        <div
          style={{
            display: "grid",
            gap: "var(--sp-md)",
            gridTemplateColumns: `repeat(${gridCols}, minmax(0, 1fr))`,
            alignItems: "start",
          }}
        >
          {validSkills.map((skill, idx) => (
            <div
              key={idx}
              className="tpl-surface"
              style={{
                padding: "var(--sp-md)",
                display: "flex",
                flexDirection: "column",
                gap: "var(--sp-sm)",
              }}
            >
              <h3
                className="tpl-heading"
                style={{ fontSize: "var(--fs-lg)", margin: 0 }}
              >
                {skill.category}
              </h3>
              <TechList technologies={skill.items} variant="minimal" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};