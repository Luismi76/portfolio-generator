// src/components/template-renderer/sections/HeaderSection.tsx
import React from "react";
import type { PortfolioData } from "../../../types/portfolio-types";
import type {
  AdvancedTemplate,
  AdvancedTemplateConfig,
} from "../../../types/advanced-template-types";
import { Icons } from "../../portfolio-icons";
import { SocialLinks } from "../components/SocialLinks";

interface HeaderSectionProps {
  data: PortfolioData;
  config?: AdvancedTemplateConfig;
  template?: AdvancedTemplate;
}

/**
 * Obtiene el background del header desde gradientes o color primario
 */
function getHeaderBackground(
  config?: AdvancedTemplateConfig,
  template?: AdvancedTemplate
): string {
  const gradients =
    config?.customizations?.colors?.gradients ?? template?.colors?.gradients;

  const gradient = gradients?.primary;

  if (gradient?.from && gradient?.to) {
    const direction = gradient.direction || "135deg";
    return `linear-gradient(${direction}, ${gradient.from}, ${gradient.to})`;
  }

  return (
    config?.customizations?.colors?.primary ??
    template?.colors?.primary ??
    "var(--color-primary)"
  );
}

/**
 * Sección Header/Hero del portfolio
 * Incluye nombre, título, avatar, botones de acción y enlaces sociales
 */
export const HeaderSection: React.FC<HeaderSectionProps> = ({
  data,
  config,
  template,
}) => {
  const headerConfig = config?.customizations.headerConfig;
  
  // ✅ CORRECCIÓN: Leer avatarUrl desde personalInfo, no desde headerConfig
  const avatarUrl = data.personalInfo.avatarUrl;
  const showAvatar = headerConfig?.showAvatar !== false && !!avatarUrl;
  
  const avatarPosition = headerConfig?.avatarPosition || "center";
  const avatarSize = (headerConfig?.avatarSize || "md") as "sm" | "md" | "lg";

  const avatarSizes: Record<"sm" | "md" | "lg", string> = {
    sm: "80px",
    md: "120px",
    lg: "160px",
  };

  const headerBg = getHeaderBackground(config, template);
  const name = data.personalInfo.fullName || "Tu Portfolio";
  const subtitle = data.personalInfo.title?.trim() || "";

  // Scroll suave a proyectos
  const handleProjectsClick: React.MouseEventHandler<HTMLAnchorElement> = (
    e
  ) => {
    const el = document.getElementById("projects");
    if (el) {
      e.preventDefault();
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  // Determinar alineación basada en posición del avatar
  const contentAlignment =
    avatarPosition === "center"
      ? "center"
      : avatarPosition === "right"
      ? "flex-end"
      : "flex-start";

  return (
    <header
      className="tpl-header tpl-header-bg"
      aria-label="Encabezado del portafolio"
      style={{
        position: "relative",
        isolation: "isolate",
        overflow: "hidden",
        paddingTop: "clamp(2rem, 5vw, var(--sp-lg))",
        paddingBottom: "clamp(2rem, 5vw, var(--sp-lg))",
        marginBottom: "var(--sp-md)",
        background: headerBg,
        color: "var(--text-on-primary, #fff)",
      }}
    >
      <div
        className="tpl-container"
        style={{
          position: "relative",
          zIndex: 1,
          display: "flex",
          flexDirection: avatarPosition === "center" ? "column" : "row",
          alignItems: avatarPosition === "center" ? "center" : "flex-start",
          gap: "var(--sp-md)",
          ...(avatarPosition === "right" && { flexDirection: "row-reverse" }),
        }}
      >
        {/* ✅ Avatar - Ahora usa avatarUrl desde personalInfo */}
        {showAvatar && (
          <img
            src={avatarUrl}
            alt={`Foto de perfil de ${name}`}
            style={{
              width: avatarSizes[avatarSize],
              height: avatarSizes[avatarSize],
              borderRadius: "50%",
              objectFit: "cover",
              border: "4px solid rgba(255,255,255,0.3)",
              boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
              flexShrink: 0,
            }}
            onError={(e) => {
              // Ocultar si falla la carga
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
            }}
          />
        )}

        {/* Contenido de texto */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "var(--sp-sm)",
            alignItems: contentAlignment,
            flex: 1,
          }}
        >
          {/* Nombre */}
          <h1
            className="tpl-heading"
            style={{
              fontSize: "clamp(2rem, 5vw, var(--fs-3xl))",
              fontWeight: 700,
              lineHeight: 1.1,
              letterSpacing: "var(--ls-tight, -0.02em)",
              color: "var(--text-on-primary, #fff)",
              textShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
              margin: 0,
            }}
          >
            {name}
          </h1>

          {/* Subtítulo */}
          {subtitle && (
            <p
              className="tpl-subtext"
              style={{
                fontSize: "clamp(1rem, 2.5vw, var(--fs-lg))",
                opacity: 0.95,
                color: "var(--text-on-primary, #fff)",
                margin: 0,
              }}
            >
              {subtitle}
            </p>
          )}

          {/* Botones de acción */}
          <div
            style={{
              display: "flex",
              gap: 12,
              flexWrap: "wrap",
              marginTop: "var(--sp-sm)",
              justifyContent: contentAlignment,
            }}
          >
            {data.personalInfo.email && (
              <a
                href={`mailto:${data.personalInfo.email}`}
                className="tpl-btn-primary"
                aria-label={`Enviar email a ${name}`}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                }}
              >
                <Icons.Mail size={16} aria-hidden="true" />
                <span>Contactar</span>
              </a>
            )}

            <a
              href="#projects"
              onClick={handleProjectsClick}
              className="tpl-btn-outline"
              aria-label="Ver mis proyectos"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                borderColor: "rgba(255,255,255,0.4)",
                color: "var(--text-on-primary, #fff)",
                backgroundColor: "transparent",
              }}
            >
              <Icons.Code size={16} aria-hidden="true" />
              <span>Ver proyectos</span>
            </a>
          </div>

          {/* Enlaces sociales usando componente reutilizable */}
          <SocialLinks
            github={data.personalInfo.github}
            linkedin={data.personalInfo.linkedin}
            website={data.personalInfo.website}
            variant="chips"
            className=""
            style={{
              marginTop: "var(--sp-xs)",
              justifyContent: contentAlignment,
            }}
          />
        </div>
      </div>

      {/* SVG decorativo de onda */}
      <svg
        aria-hidden="true"
        viewBox="0 0 1440 120"
        preserveAspectRatio="none"
        style={{
          position: "absolute",
          left: 0,
          bottom: 0,
          width: "100%",
          height: 32,
          opacity: 0.15,
          pointerEvents: "none",
          zIndex: 0,
        }}
      >
        <path
          d="M0,64 C240,128 480,0 720,32 C960,64 1200,176 1440,96 L1440,160 L0,160 Z"
          fill="currentColor"
        />
      </svg>
    </header>
  );
};