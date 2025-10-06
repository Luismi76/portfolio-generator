// src/components/template-renderer/sections/ExperienceSection.tsx
import React from "react";
import type { PortfolioData } from "../../../types/portfolio-types";

interface ExperienceSectionProps {
  data: PortfolioData;
}

/**
 * Sección de Experiencia del portfolio
 * Muestra experiencia laboral (actualmente placeholder)
 */
export const ExperienceSection: React.FC<ExperienceSectionProps> = ({
  data,
}) => {
  return (
    <section
      style={{ paddingTop: "var(--sp-lg)", paddingBottom: "var(--sp-lg)" }}
    >
      <div className="tpl-container">
        <h2
          className="tpl-heading"
          style={{ fontSize: "var(--fs-2xl)", marginBottom: "var(--sp-md)" }}
        >
          Experiencia
        </h2>
        <div className="tpl-surface" style={{ padding: "var(--sp-md)" }}>
          <p className="tpl-subtext" style={{ fontSize: "var(--fs-base)" }}>
            Añade tu experiencia profesional desde el editor.
          </p>
        </div>
      </div>
    </section>
  );
};