// src/components/ProjectDetailPage.tsx
import React from "react";
import type { Project, PortfolioData } from "../types/portfolio-types";
import type { AdvancedTemplate, AdvancedTemplateConfig } from "../types/advanced-template-types";
import { TemplateTheme } from "./TemplateTheme";
import { TechList } from "./TechIcons";
import { Icons } from "./portfolio-icons";

interface ProjectDetailPageProps {
  project: Project;
  data: PortfolioData;
  template: AdvancedTemplate;
  config?: AdvancedTemplateConfig;
}

export const ProjectDetailPage: React.FC<ProjectDetailPageProps> = ({
  project,
  data,
  template,
  config,
}) => {
  // Obtener background del header (igual que en TemplateRenderer)
  const getHeaderBackground = (): string => {
    const gradients =
      config?.customizations?.colors?.gradients ??
      template?.colors?.gradients;

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
  };

  const headerBg = getHeaderBackground();

  // Helper para validar URLs
/*   const isValidUrl = (url?: string): boolean => {
    if (!url) return false;
    try {
      new URL(url.startsWith("http") ? url : `https://${url}`);
      return true;
    } catch {
      return false;
    }
  }; */

  // Parsear imágenes
  const images = project.images
    ? project.images.split(",").map(img => img.trim()).filter(img => img)
    : [];

  // Parsear videos
  const videos = project.videos
    ? project.videos.split(",").map(v => v.trim()).filter(v => v)
    : [];

  // Parsear features
  const features = project.features
    ? project.features.split(",").map(f => f.trim()).filter(f => f)
    : [];

  // Helper para embed de videos
  const getVideoEmbedUrl = (url: string): string => {
    if (url.includes("youtube.com/watch")) {
      const videoId = url.split("v=")[1]?.split("&")[0];
      return `https://www.youtube.com/embed/${videoId}`;
    }
    if (url.includes("youtu.be/")) {
      const videoId = url.split("youtu.be/")[1]?.split("?")[0];
      return `https://www.youtube.com/embed/${videoId}`;
    }
    if (url.includes("vimeo.com/")) {
      const videoId = url.split("vimeo.com/")[1]?.split("?")[0];
      return `https://player.vimeo.com/video/${videoId}`;
    }
    return url;
  };

  // Template base para TemplateTheme
  const themeTemplate = {
    ...template,
    colors: {
      ...template.colors,
      primary: template.colors.primary,
      secondary: template.colors.secondary,
      accent: template.colors.accent,
      background: template.colors.background,
      surface: template.colors.surface,
      text: template.colors.text,
    },
  } as any;

  return (
    <TemplateTheme template={themeTemplate} config={config}>
      {/* Header con navegación */}
      <header
        className="tpl-header"
        style={{
          position: "relative",
          isolation: "isolate",
          overflow: "hidden",
          paddingTop: "var(--sp-lg)",
          paddingBottom: "var(--sp-lg)",
          marginBottom: "var(--sp-md)",
          background: headerBg,
          color: "var(--text-on-primary, #fff)",
        }}
      >
        <div className="tpl-container">
          {/* Botón volver */}
          <a
            href="index.html"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              color: "rgba(255, 255, 255, 0.9)",
              textDecoration: "none",
              marginBottom: "var(--sp-md)",
              fontSize: "var(--fs-sm)",
              transition: "opacity 0.2s",
            }}
          >
            ← Volver al Portfolio
          </a>

          {/* Título del proyecto */}
          <h1
            className="tpl-heading"
            style={{
              fontSize: "clamp(2rem, 5vw, var(--fs-3xl))",
              fontWeight: 700,
              lineHeight: 1.1,
              color: "var(--text-on-primary, #fff)",
              margin: "0 0 var(--sp-sm) 0",
            }}
          >
            {project.title}
          </h1>

          {/* Descripción corta */}
          {project.description && (
            <p
              style={{
                fontSize: "var(--fs-lg)",
                opacity: 0.95,
                color: "var(--text-on-primary, #fff)",
                margin: "0 0 var(--sp-md) 0",
              }}
            >
              {project.description}
            </p>
          )}

          {/* Enlaces principales */}
          <div
            style={{
              display: "flex",
              gap: "12px",
              flexWrap: "wrap",
            }}
          >
            {project.link && (
              <a
                href={project.link}
                target="_blank"
                rel="noopener noreferrer"
                className="tpl-btn-primary"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                  textDecoration: "none",
                }}
              >
                <Icons.Globe size={16} />
                Ver Proyecto Live
              </a>
            )}
            {project.github && (
              <a
                href={project.github}
                target="_blank"
                rel="noopener noreferrer"
                className="tpl-btn-outline"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                  borderColor: "rgba(255,255,255,0.4)",
                  color: "var(--text-on-primary, #fff)",
                  textDecoration: "none",
                }}
              >
                <Icons.Github size={16} />
                Ver Código
              </a>
            )}
          </div>
        </div>

        {/* SVG decorativo */}
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

      {/* Contenido principal */}
      <main className="tpl-container">
        {/* Imagen principal */}
        {project.image && (
          <div style={{ marginBottom: "var(--sp-lg)" }}>
            <img
              src={project.image}
              alt={project.title}
              style={{
                width: "100%",
                height: "auto",
                maxHeight: "500px",
                objectFit: "cover",
                borderRadius: "var(--br-lg)",
              }}
            />
          </div>
        )}

        {/* Tecnologías */}
        {project.technologies && (
          <section style={{ marginBottom: "var(--sp-lg)" }}>
            <h2
              className="tpl-heading"
              style={{ fontSize: "var(--fs-xl)", marginBottom: "var(--sp-md)" }}
            >
              Tecnologías utilizadas
            </h2>
            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
              <TechList technologies={project.technologies} variant="default" />
            </div>
          </section>
        )}

        {/* Descripción detallada */}
        {project.detailedDescription && (
          <section
            className="tpl-surface"
            style={{ padding: "var(--sp-lg)", marginBottom: "var(--sp-lg)" }}
          >
            <h2
              className="tpl-heading"
              style={{ fontSize: "var(--fs-xl)", marginBottom: "var(--sp-md)" }}
            >
              Acerca del Proyecto
            </h2>
            <p
              className="tpl-subtext"
              style={{ fontSize: "var(--fs-base)", lineHeight: 1.6, margin: 0 }}
            >
              {project.detailedDescription}
            </p>
          </section>
        )}

        {/* Videos demostrativos */}
        {videos.length > 0 && (
          <section style={{ marginBottom: "var(--sp-lg)" }}>
            <h2
              className="tpl-heading"
              style={{ fontSize: "var(--fs-xl)", marginBottom: "var(--sp-md)" }}
            >
              Videos Demostrativos
            </h2>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
                gap: "var(--sp-md)",
              }}
            >
              {videos.map((videoUrl, index) => (
                <div key={index} style={{ aspectRatio: "16/9" }}>
                  <iframe
                    src={getVideoEmbedUrl(videoUrl)}
                    title={`Video ${index + 1} - ${project.title}`}
                    style={{
                      width: "100%",
                      height: "100%",
                      borderRadius: "var(--br-md)",
                      border: "none",
                    }}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Galería de imágenes */}
        {images.length > 0 && (
          <section style={{ marginBottom: "var(--sp-lg)" }}>
            <h2
              className="tpl-heading"
              style={{ fontSize: "var(--fs-xl)", marginBottom: "var(--sp-md)" }}
            >
              Galería
            </h2>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
                gap: "var(--sp-md)",
              }}
            >
              {images.map((img, index) => (
                <img
                  key={index}
                  src={img}
                  alt={`${project.title} - Imagen ${index + 1}`}
                  style={{
                    width: "100%",
                    height: "200px",
                    objectFit: "cover",
                    borderRadius: "var(--br-md)",
                  }}
                />
              ))}
            </div>
          </section>
        )}

        {/* Características principales */}
        {features.length > 0 && (
          <section
            className="tpl-surface"
            style={{ padding: "var(--sp-lg)", marginBottom: "var(--sp-lg)" }}
          >
            <h2
              className="tpl-heading"
              style={{ fontSize: "var(--fs-xl)", marginBottom: "var(--sp-md)" }}
            >
              Características Principales
            </h2>
            <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
              {features.map((feature, index) => (
                <li
                  key={index}
                  style={{
                    padding: "8px 0",
                    borderBottom:
                      index < features.length - 1
                        ? "1px solid rgba(0,0,0,0.1)"
                        : "none",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                  }}
                >
                  <span style={{ color: "var(--color-accent)" }}>✓</span>
                  <span className="tpl-subtext">{feature}</span>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Instrucciones de uso */}
        {project.instructions && (
          <section
            className="tpl-surface"
            style={{ padding: "var(--sp-lg)", marginBottom: "var(--sp-lg)" }}
          >
            <h2
              className="tpl-heading"
              style={{ fontSize: "var(--fs-xl)", marginBottom: "var(--sp-md)" }}
            >
              Instrucciones de Uso
            </h2>
            <pre
              style={{
                whiteSpace: "pre-wrap",
                background: "var(--color-bg)",
                padding: "var(--sp-md)",
                borderRadius: "var(--br-md)",
                overflow: "auto",
                fontFamily: "var(--font-code, monospace)",
                fontSize: "var(--fs-sm)",
                margin: 0,
              }}
            >
              {project.instructions}
            </pre>
          </section>
        )}

        {/* Desafíos técnicos */}
        {project.challenges && (
          <section
            className="tpl-surface"
            style={{ padding: "var(--sp-lg)", marginBottom: "var(--sp-lg)" }}
          >
            <h2
              className="tpl-heading"
              style={{ fontSize: "var(--fs-xl)", marginBottom: "var(--sp-md)" }}
            >
              Desafíos Técnicos
            </h2>
            <p
              className="tpl-subtext"
              style={{ fontSize: "var(--fs-base)", lineHeight: 1.6, margin: 0 }}
            >
              {project.challenges}
            </p>
          </section>
        )}

        {/* Botón volver al portfolio */}
        <div style={{ textAlign: "center", paddingTop: "var(--sp-lg)" }}>
          <a
            href="index.html"
            className="tpl-btn-primary"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              padding: "12px 24px",
              textDecoration: "none",
            }}
          >
            ← Volver al Portfolio
          </a>
        </div>
      </main>

      {/* Footer */}
      <footer
        className="tpl-header"
        style={{
          marginTop: "var(--sp-xl)",
          padding: "var(--sp-lg) 0",
          background: headerBg,
        }}
      >
        <div className="tpl-container" style={{ textAlign: "center" }}>
          <p
            style={{
              color: "rgba(255, 255, 255, 0.95)",
              fontWeight: 500,
              fontSize: "var(--fs-base)",
              margin: "0 0 4px 0",
            }}
          >
            {data.personalInfo.fullName || "Tu Nombre"}
          </p>
          <p
            style={{
              color: "rgba(255, 255, 255, 0.7)",
              fontSize: "var(--fs-sm)",
              margin: 0,
            }}
          >
            © {new Date().getFullYear()} • Todos los derechos reservados
          </p>
        </div>
      </footer>
    </TemplateTheme>
  );
};