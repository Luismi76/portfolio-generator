// src/components/template-renderer/sections/FooterSection.tsx
import React from "react";
import type { PortfolioData } from "../../../types/portfolio-types";
import type {
  AdvancedTemplate,
  AdvancedTemplateConfig,
} from "../../../types/advanced-template-types";
import { Icons } from "../../portfolio-icons";
import { SocialLinks } from "../components/SocialLinks";

interface FooterSectionProps {
  data: PortfolioData;
  config?: AdvancedTemplateConfig;
  template?: AdvancedTemplate;
}

/**
 * Sección Footer/Contact del portfolio
 * Incluye enlaces sociales, nombre, copyright y mensaje
 */
export const FooterSection: React.FC<FooterSectionProps> = ({
  data,
  config,
  template,
}) => {
  const { personalInfo } = data;

  const primary =
    config?.customizations?.colors?.primary ??
    template?.colors?.primary ??
    "var(--color-primary)";

  const secondary =
    config?.customizations?.colors?.secondary ??
    template?.colors?.secondary ??
    "var(--color-secondary)";

  const footerBackground = `linear-gradient(135deg, ${primary}, ${secondary})`;

  return (
    <footer
      style={{
        background: footerBackground,
        color: "var(--text-on-primary, #fff)",
      }}
    >
      <div className="tpl-container">
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "var(--sp-md)",
          }}
        >
          {/* Enlaces sociales con iconos circulares */}
          <SocialLinks
            github={personalInfo.github}
            linkedin={personalInfo.linkedin}
            website={personalInfo.website}
            email={personalInfo.email}
            variant="circles"
          />

          {/* Información personal */}
          <div style={{ textAlign: "center" }}>
            <p
              style={{
                color: "rgba(255, 255, 255, 0.95)",
                fontWeight: 500,
                fontSize: "var(--fs-base)",
                margin: 0,
              }}
            >
              {personalInfo.fullName || "Tu Nombre"}
            </p>
            <p
              style={{
                color: "rgba(255, 255, 255, 0.7)",
                fontSize: "var(--fs-sm)",
                marginTop: 4,
                marginBottom: 0,
              }}
            >
              © {new Date().getFullYear()} • Todos los derechos reservados
            </p>
          </div>

          {/* Mensaje "Hecho con amor" */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              color: "rgba(255, 255, 255, 0.6)",
              fontSize: "var(--fs-xs)",
            }}
          >
            <span>Hecho con</span>
            <span
              style={{
                color: "#ef4444",
                display: "flex",
                alignItems: "center",
              }}
            >
              <Icons.Heart size={12} />
            </span>
            <span>usando React y TypeScript</span>
          </div>
        </div>
      </div>
    </footer>
  );
};