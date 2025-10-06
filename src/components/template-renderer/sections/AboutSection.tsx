// src/components/template-renderer/sections/AboutSection.tsx
import React from "react";
import type { PortfolioData } from "../../../types/portfolio-types";

interface AboutSectionProps {
  data: PortfolioData;
}

/**
 * Sección "Sobre mí" del portfolio
 * Muestra el resumen/biografía del usuario
 */
export const AboutSection: React.FC<AboutSectionProps> = ({ data }) => {
  const { summary } = data.personalInfo;
  
  if (!summary) return null;

  return (
    <section
      id="about"
      style={{
        position: "relative",
        zIndex: 1,
        background: "var(--color-surface, #fff)",
        paddingTop: "var(--sp-lg)",
        paddingBottom: "var(--sp-lg)",
      }}
    >
      <div className="tpl-container">
        <h2 className="tpl-heading" style={{ fontSize: "var(--fs-2xl)" }}>
          Sobre mí
        </h2>
      </div>
      <div className="tpl-container">
        <div className="tpl-surface" style={{ padding: 0 }}>
          <p className="tpl-subtext" style={{ fontSize: "var(--fs-base)" }}>
            {summary}
          </p>
        </div>
      </div>
    </section>
  );
};